function exibeError(mensagem) {
  return Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: mensagem,
    confirmButtonText: 'OK'
  });
}