import random
import logging
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
            self.sched.add_interval_job(self.check_user_goals,
                    minutes=self.poll_rate + random.randint(-2, 2),
                    kwargs={"user_id": user['_id']})

        logging.getLogger("apscheduler").addHandler(logging.StreamHandler())
        self.sched.start()

    def check_user_goals(self, user_id):
        log.debug("Going to check goals for user %s", user_id)

        user = self.db.users.find_one({"_id": user_id})
        if user is None:
            self.warning("User `%s` not found", user_id)
            return

        for goal in user.get('goals', []):
            try:
                g = Goal.from_dict(goal)
            except InvalidGoalError as e:
                self.error("Error on checking goal: %s", e)
                continue

            else:
                g.execute()

