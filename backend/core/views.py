from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Usuario, Categoria, Chamado, Comentario, Anexo
from .serializers import (
    UsuarioSerializer,
    CategoriaSerializer,
    ChamadoSerializer,
    ComentarioSerializer,
    AnexoSerializer,
)
from rest_framework.permissions import IsAuthenticated


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'create':  # permitir POST /usuarios/
            return [AllowAny()]
        return [IsAuthenticated()]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]


class ChamadoViewSet(viewsets.ModelViewSet):
    serializer_class = ChamadoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.tipo_usuario == 'cliente':
            return Chamado.objects.filter(usuario=user)
        elif user.tipo_usuario == 'tecnico':
            return Chamado.objects.filter(tecnico=user)
        return Chamado.objects.none()



class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]


class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.all()
    serializer_class = AnexoSerializer
    permission_classes = [IsAuthenticated]
