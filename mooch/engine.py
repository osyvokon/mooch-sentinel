import random
import logging
import datetime
from apscheduler.scheduler import Scheduler
from mooch.goals import Goal, InvalidGoalError

log = logging.getLogger(__name__)
log.addHandler(logging.StreamHandler())


class Engine(object):
    """Periodically checks for goals completion.

    `db` - mongo database from which user goals will be read.
    `poll_rate` - how often (on average) goals will be polled, minutes.
    This value will be randomized to avoid spikes.

    """

    def __init__(self, db, poll_rate=5):
        self.db = db
        self.poll_rate = poll_rate
        self.sched = Scheduler()


    def start(self):
        for user in self.db.users.find():
            self.sched.add_interval_job(self.update_user_achievements,
                    minutes=self.poll_rate + random.randint(-2, 2),
                    kwargs={"user_id": user['_id']})

        logging.getLogger("apscheduler").addHandler(logging.StreamHandler())
        self.sched.start()

    def user_status(self, user_id, date=None):
        date = date or datetime.datetime.now()
        achievements = self.db.achievements.find({"user": user_id})
        goals = [{
            "goal": a['goal'],
            "achieved": goal_achieved(a, date)
            } for a in achievements]
        okay = all(goal['achieved'] for goal in goals)

        return {"okay": okay,
                "goals": goals}

    def update_user_achievements(self, user_id):
        log.debug("Going to check goals for user %s", user_id)

        for goal in self.user_goals(user_id):
            achievements = goal.check_achievements()
            self.db.achievements.update(
                    {"user": user_id, "goal": goal.to_dict()},
                    {"$addToSet": {"achievements": {"$each": achievements}}},
                    upsert=True)

    def user_goals(self, user_id):
        """List of user's goals (``Goal`` objects). """

        user = self.db.users.find_one({"_id": user_id})
        if user is None:
            log.warning("User `%s` not found", user_id)
            return []

        goals = []
        for goal_spec in user.get('goals', []):
            try:
                goal = Goal.from_dict(goal_spec)
            except InvalidGoalError as e:
                log.error("Error reading goal config: %s", e)
                continue
            else:
                goals.append(goal)

        return goals

def goal_achieved(achievements, date):
    d = date.date()
    return any(a['date'].date() == d for a in achievements['achievements'])
