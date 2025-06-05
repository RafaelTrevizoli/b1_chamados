from rest_framework import viewsets, filters
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
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descricao']

    def get_queryset(self):
        user = self.request.user
        queryset = Chamado.objects.all()

        # Filtros opcionais
        status = self.request.query_params.get('status')
        prioridade = self.request.query_params.get('prioridade')
        categoria = self.request.query_params.get('categoria')

        if user.tipo_usuario == 'cliente':
            queryset = queryset.filter(usuario=user)
        elif user.tipo_usuario == 'tecnico':
            queryset = queryset.filter(tecnico=user)

        if status:
            queryset = queryset.filter(status=status)
        if prioridade:
            queryset = queryset.filter(prioridade=prioridade)
        if categoria:
            queryset = queryset.filter(categoria=categoria)

        return queryset


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]


class AnexoViewSet(viewsets.ModelViewSet):
    queryset = Anexo.objects.all()
    serializer_class = AnexoSerializer
    permission_classes = [IsAuthenticated]
