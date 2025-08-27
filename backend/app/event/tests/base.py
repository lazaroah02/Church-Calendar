from django.test import TestCase, override_settings
import os
import shutil
from django.conf import settings

TEST_IMAGES_FOLDER = "test_media"

test_media_root = os.path.join(settings.BASE_DIR, TEST_IMAGES_FOLDER)


@override_settings(MEDIA_ROOT=test_media_root)
class MediaRootCleanUpTestCase(TestCase):
    """
    Ensures MEDIA_ROOT is overridden and cleaned up after tests.
    """

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        if os.path.exists(test_media_root):
            shutil.rmtree(test_media_root)
