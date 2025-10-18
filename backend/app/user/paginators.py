from rest_framework.pagination import PageNumberPagination


class NoPagination(PageNumberPagination):
    page_size = None


class UsersPagination(PageNumberPagination):
    page_size = 25
    max_page_size = 100
    page_size_query_param = 'page_size'