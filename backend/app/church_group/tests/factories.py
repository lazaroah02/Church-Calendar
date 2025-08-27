import factory
from church_group.models import ChurchGroup


class ChurchGroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ChurchGroup

    name = factory.Sequence(lambda n: f"Group {n}")
    description = factory.Faker("sentence", nb_words=8)
    img = None
