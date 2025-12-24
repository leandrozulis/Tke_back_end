async function exportarDados() {

  const token = localStorage.getItem("token");

   try {
    let response = await fetch(BASE_URL + "/product/export", {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      exibeErro("Erro ao Exportar!");
      return;
    }

    const blob = await response.blob();

    // Criar URL temporária
    const url = window.URL.createObjectURL(blob);

    // Criar link invisível
    const a = document.createElement("a");
    a.href = url;
    a.download = "produtos.xlsx";
    document.body.appendChild(a);
    a.click();

    // Limpeza
    a.remove();
    window.URL.revokeObjectURL(url);

    exibeSucesso(`Exportação concluída!`);
    fecharModalExportar();

  } catch (err) {
    exibeErro("Falha ao enviar o arquivo.");
  }
}