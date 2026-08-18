from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check_view(request):
    """Production healthcheck endpoint for Railway / load balancer probes."""
    return Response({"status": "ok", "service": "lms-backend"})


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_view(request):
    return Response({
        "message": "Training, Learning & Placement LMS API",
        "health": request.build_absolute_uri('/api/health/'),
        "documentation": request.build_absolute_uri('/api/docs/'),
        "swagger_ui": request.build_absolute_uri('/api/docs/'),
        "redoc_ui": request.build_absolute_uri('/api/redoc/'),
        "endpoints": {
            "auth": request.build_absolute_uri('/api/auth/'),
            "students": request.build_absolute_uri('/api/students/'),
            "batches": request.build_absolute_uri('/api/batches/'),
            "learning": request.build_absolute_uri('/api/learning/'),
            "questions": request.build_absolute_uri('/api/questions/'),
            "tests": request.build_absolute_uri('/api/tests/'),
            "coding": request.build_absolute_uri('/api/coding/'),
            "sql": request.build_absolute_uri('/api/sql/'),
            "attendance": request.build_absolute_uri('/api/attendance/'),
            "leaves": request.build_absolute_uri('/api/leaves/'),
            "interviews": request.build_absolute_uri('/api/interviews/'),
            "placement": request.build_absolute_uri('/api/placement/'),
            "certificates": request.build_absolute_uri('/api/certificates/'),
        }
    })


def root_redirect_view(request):
    return redirect('/api/docs/')


urlpatterns = [
    path('', root_redirect_view, name='root-redirect'),
    path('api/health/', health_check_view, name='health-check'),
    path('api/', api_root_view, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/students/', include('apps.students.urls')),
    path('api/batches/', include('apps.batches.urls')),
    path('api/learning/', include('apps.learning.urls')),
    path('api/questions/', include('apps.questions.urls')),
    path('api/tests/', include('apps.tests.urls')),
    path('api/coding/', include('apps.coding.urls')),
    path('api/sql/', include('apps.sqlpractice.urls')),
    path('api/attendance/', include('apps.attendance.urls')),
    path('api/leaves/', include('apps.leaves.urls')),
    path('api/interviews/', include('apps.interviews.urls')),
    path('api/placement/', include('apps.placement.urls')),
    path('api/certificates/', include('apps.certificates.urls')),
    
    # OpenAPI 3 Schema & UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
