import factory
from django.utils import timezone
from event.models import Event, Reservation
from church_group.tests.factories import ChurchGroupFactory
import user.tests.factories as UserFactory


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    title = factory.Sequence(lambda n: f"Event {n}")
    start_time = factory.LazyFunction(lambda: timezone.now())
    end_time = factory.LazyFunction(
        lambda: timezone.now() + timezone.timedelta(hours=2)
        )
    description = factory.Faker("sentence", nb_words=10)
    location = factory.Faker("city")

    created_by = factory.SubFactory(UserFactory)
    last_edit_by = factory.SubFactory(UserFactory)

    visible = True
    is_canceled = False
    open_to_reservations = True

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            # Si paso grupos explícitos: EventFactory(groups=[g1, g2])
            for group in extracted:
                self.groups.add(group)
        else:
            # Por defecto crea un grupo y lo asigna
            group = ChurchGroupFactory()
            self.groups.add(group)


class ReservationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Reservation

    event = factory.SubFactory(EventFactory)
    user = factory.SubFactory(UserFactory)
