function exibeAtencao(mensagem) {
  return Swal.fire({
    icon: 'warning',
    title: 'Atenção!',
    text: mensagem,
    confirmButtonText: 'OK'
  });
}