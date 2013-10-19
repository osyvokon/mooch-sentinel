from .codeforces import Codeforces

KNOWN_GOALS = [Codeforces]


class InvalidGoalError(Exception):
    pass

class Goal(object):

    @staticmethod
    def from_dict(cfg):
        """Return Goal object, initialized from `cfg` structure.
        """

        try:
            goal_class = [g for g in KNOWN_GOALS if g.goal_id == cfg['goal']][0]
        except LookupError:
            raise InvalidGoalError("Unknown goal `%s`" % cfg['goal'])

        return goal_class.from_dict(cfg)
        
