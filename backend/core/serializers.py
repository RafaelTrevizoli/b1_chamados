from rest_framework import serializers
from .models import Usuario, Categoria, Chamado, Comentario, Anexo


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'tipo_usuario', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        senha = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(senha)
        user.save()
        return user

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'chamado', 'usuario', 'usuario_nome', 'mensagem']


class AnexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anexo
        fields = ['id', 'chamado', 'arquivo']


class ChamadoSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)
    anexos = AnexoSerializer(many=True, read_only=True)  # ADICIONE ISSO

    class Meta:
        model = Chamado
        fields = '__all__'

    def validate(self, data):
        # Apenas valide se os campos estiverem presentes (evita erro em PATCH)
        if 'usuario' in data and data['usuario'].tipo_usuario != 'cliente':
            raise serializers.ValidationError("Somente clientes podem abrir chamados.")
        if 'tecnico' in data and data['tecnico'] and data['tecnico'].tipo_usuario != 'tecnico':
            raise serializers.ValidationError("O técnico atribuído deve ter o tipo 'técnico'.")
        return data
