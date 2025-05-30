from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nome, senha=None, tipo_usuario='cliente'):
        if not email:
            raise ValueError("O e-mail é obrigatório")
        email = self.normalize_email(email)
        usuario = self.model(email=email, nome=nome, tipo_usuario=tipo_usuario)
        usuario.set_password(senha)
        usuario.save()
        return usuario

    def create_superuser(self, email, nome, senha):
        usuario = self.create_user(email, nome, senha, tipo_usuario='tecnico')
        usuario.is_superuser = True
        usuario.is_staff = True
        usuario.save()
        return usuario


class Usuario(AbstractBaseUser, PermissionsMixin):
    TIPOS = (
        ('cliente', 'Cliente'),
        ('tecnico', 'Técnico'),
    )

    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=100)
    tipo_usuario = models.CharField(max_length=10, choices=TIPOS)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    def __str__(self):
        return self.email


class Categoria(models.Model):
    nome = models.CharField(max_length=50)
    descricao = models.TextField(blank=True)

    def __str__(self):
        return self.nome


class Chamado(models.Model):
    STATUS = (
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em andamento'),
        ('fechado', 'Fechado'),
    )
    PRIORIDADE = (
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    )
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS, default='aberto')
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE, default='media')
    usuario = models.ForeignKey(Usuario, related_name='chamados_criados', on_delete=models.CASCADE)
    tecnico = models.ForeignKey(Usuario, related_name='chamados_designados', null=True, blank=True,
                                on_delete=models.SET_NULL)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Comentario(models.Model):
    chamado = models.ForeignKey(Chamado, related_name='comentarios', on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.nome} - {self.chamado.titulo}"


class Anexo(models.Model):
    chamado = models.ForeignKey(Chamado, related_name='anexos', on_delete=models.CASCADE)
    arquivo = models.FileField(upload_to='anexos/')

    def __str__(self):
        return f"Anexo para {self.chamado.titulo}"

