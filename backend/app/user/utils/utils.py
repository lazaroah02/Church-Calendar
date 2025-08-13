from django.contrib.auth.password_validation import (
    MinimumLengthValidator,
    UserAttributeSimilarityValidator,
    CommonPasswordValidator,
    NumericPasswordValidator
    )


def validate_password(password):
    MinimumLengthValidator().validate(password=password)
    UserAttributeSimilarityValidator().validate(password=password)
    CommonPasswordValidator().validate(password=password)
    NumericPasswordValidator().validate(password=password)
    return password
