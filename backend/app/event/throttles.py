from rest_framework.throttling import UserRateThrottle


class EventReservationThrottle(UserRateThrottle):
    rate = '3/minute'
