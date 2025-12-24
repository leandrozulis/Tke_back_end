function exibeSucesso(mensagem) {
  return Swal.fire({
    icon: 'success',
    title: 'Sucesso',
    text: mensagem,
    confirmButtonText: 'OK'
  });
}