from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UsuarioViewSet, CategoriaViewSet, ChamadoViewSet,
    ComentarioViewSet, AnexoViewSet,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'comentarios', ComentarioViewSet)
router.register(r'anexos', AnexoViewSet)

urlpatterns = [
    path('', include(router.urls)),  # ✅ removido 'api/' aqui!
]
