async function enviarExcel() {
  const token = localStorage.getItem("token");

  const input = document.getElementById("arquivoImportar");
  const file = input.files[0];

  const formData = new FormData();
  formData.append("arquivo", file);

  try {
    const response = await fetch(BASE_URL + "/product/upload", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      alert("Erro ao importar!");
      return;
    }

    exibeSucesso(`Importação concluída! ${result.total} registros salvos.`);

    fecharModalImportar()

  } catch (err) {
    exibeErro("Falha ao enviar o arquivo.");
  }
}