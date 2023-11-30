if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        let reg;
        reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
  
        console.log(reg);
      } catch (err) {
        console.log(err);
      }
    });
  }

let posicaoinicial;
let localizacao = document.getElementsByClassName('localizacao');
let longitude = document.getElementById('longitude');
let latitude = document.getElementById('latitude');
 
const capturar = (posicao) => posicaoinicial(posicao);
latitude.innerHTML = posicaoinicial.coords.latitude;
longitude.innerHTML = posicaoinicial.coords.longitude;

const erro = (error) => {
let errorMessage;
switch(error.code){
  case 0:
    errorMessage = "Erro desconhecido"
    break;
    case 1:
      errorMessage = "Permissão Negada"
      break;
      case 2: 
       errorMessage = "Captura de posição indisponivel"
      break;
      case 3:
        errorMessage = "Tempo de solicitação excedido"
        break;
}
console.log('Ocorreu um erro' + errorMessage)
}

localizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});
