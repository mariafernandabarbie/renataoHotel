import { openDB } from "idb";

window.addEventListener('DOMContentLoaded', async event =>{
    criarDB();
    document.getElementById('btnCadastro').addEventListener('click', adicionarHotel);
    document.getElementById('btnCarregar').addEventListener('click', buscarTodosHoteis);
});

let db;

async function criarDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('hotel', {
                            keyPath: 'titulo' 
                        });
                        store.createIndex('id', 'id');
                        console.log("Banco de dados criado!");
                }
            }
        })
        console.log("banco de dados aberto!");
    } catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}

async function buscarTodosHoteis(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
        return;
    }
    const tx = await db.transaction('hotel', 'readonly');
    const store = await tx.objectStore('hotel');
    const hoteis = await store.getAll();
    if(hoteis){
        const divLista = hoteis.map(hotel => {
            return `<div class="item">
                    <h1>${hotel.titulo}</h1> 
                    <spam>${hotel.avaliacao}</spam>
                    <p>${hotel.descricao}</p>
                    <spam>${hotel.local}</spam><br/>
                    <spam>${hotel.latitude}-${hotel.longitude}</spam><br/>
                    <button class="btnDeletar" data-item-id="${hotel.titulo}" data-item-avaliacao="${hotel.avaliacao}" data-item-descricao="${hotel.descricao}" data-item-local="${hotel.local}" data-item-latitude="${hotel.latitude}" data-item-longitude="${hotel.longitude}">Deletar</button>
                    <button class="btnAlterar" data-item-id="${hotel.titulo}" data-item-avaliacao="${hotel.avaliacao}" data-item-descricao="${hotel.descricao}" data-item-local="${hotel.local}" data-item-latitude="${hotel.latitude}" data-item-longitude="${hotel.longitude}">Alterar</button>
                   </div>`;
        });
        listagem(divLista.join(' '));
    }
}

async function adicionarHotel() {
    let titulo = document.getElementById("titulo").value;
    let avaliacao = document.getElementById("avaliacao").value;
    let descricao = document.getElementById("descricao").value;
    let local = document.getElementById("local").value; 
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;
    const tx = await db.transaction('hotel', 'readwrite')
    const store = await tx.objectStore('hotel');
    try {
        await store.add({ titulo: titulo, descricao: descricao, local: local, avaliacao: avaliacao, latitude: latitude, longitude: longitude  });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');
        buscarTodosHoteis();
        return;
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

function limparCampos() {
    document.getElementById("titulo").value = '';
    document.getElementById("descricao").value = '';
    document.getElementById("local").value = '';
    document.getElementById("avaliacao").value = '';
    document.getElementById("latitude").value = '';
    document.getElementById("longitude").value = '';

}

function listagem(text) {
    document.getElementById('lista').innerHTML = text;
    const deleteButtons = document.querySelectorAll('.btnDeletar');
    const alterarButtons = document.querySelectorAll('.btnAlterar');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const itemId = button.getAttribute('data-item-id');
            if (itemId) {
                await deletarHotel(itemId);
            }
        });
    });

    alterarButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const avaliacao = button.getAttribute('data-item-avaliacao');
            const descricao = button.getAttribute('data-item-descricao');
            const local = button.getAttribute('data-item-local');
            const latitude = button.getAttribute('data-item-latitude');
            const longitude = button.getAttribute('data-item-longitude');
            const itemId = button.getAttribute('data-item-id');

            await alterarHotel(itemId, avaliacao, descricao, local, latitude, longitude);
        });
    });
}

async function alterarHotel(titulo, avaliacao, descricao, local, latitude, longitude) {
    const div = document.getElementById("alterar")
    const formulario = document.createElement("div");
    div.style.display = 'block';
    div.scrollIntoView({ behavior: 'smooth' });
    formulario.innerHTML = `
        <h1>Editar Dados</h1>
        <input type="text" id="editTitulo" value="${titulo}">
        <br>
        <input type="text" id="editavaliacao" value="${avaliacao}">
        <br>
        <input type="text" id="editDescricao" value="${descricao}">
        <br>
        <input type="text" id="editLocal" value="${local}">
        <br>
        <input type="text" id="editLatitude" value="${latitude}">
        <br>
        <input type="text" id="editLongitude" value="${longitude}">
        <br>
        <button id="btnSalvarEdicao">Salvar</button>
    `;
    

        document.getElementById("alterar").appendChild(formulario);
    
       try{
            const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");
            btnSalvarEdicao.addEventListener("click", async () => {
            const novoTitulo = document.getElementById("editTitulo").value;
            const novaavaliacao = document.getElementById("editavaliacao").value;
            const novaDescricao = document.getElementById("editDescricao").value;
            const novoLocal = document.getElementById("editLocal").value;
            const novaLatitude = document.getElementById("editLatitude").value;
            const novaLongitude = document.getElementById("editLongitude").value;
    
            const tx = await db.transaction('hotel', 'readwrite');
            const store = tx.objectStore('hotel');
            await store.delete(titulo); 
            await store.add({ titulo: novoTitulo, descricao: novaDescricao, local: novoLocal, avaliacao: novaavaliacao, latitude:novaLatitude, longitude:novaLongitude }); // Adiciona o registro atualizado
            await tx.done;

            formulario.remove();
            
            buscarTodosHoteis();
        })}catch{
        console.error('Erro ao deletar registro:', error);
        tx.abort();
       } 
       
        }

async function deletarHotel(itemId) {
    const tx = await db.transaction('hotel', 'readwrite');
    const store = await tx.objectStore('hotel');
    try {
        await store.delete(itemId);
        await tx.done;
        console.log('Registro deletado com sucesso!');
        buscarTodosHoteis();
    } catch (error) {
        console.error('Erro ao deletar registro:', error);
        tx.abort();
    }
}

async function buscar(titulo) {
    if (!db) {
        console.log("O banco de dados está fechado.");
        return;
    }

    const tx = await db.transaction('hotel', 'readonly');
    const store = await tx.objectStore('hotel');

    try {
        const hotel = await store.get(titulo);

        if (hotel) {
            console.log('Hotel encontrado:');
            console.log(hotel);

            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.style.display = 'block';
            resultadosDiv.innerHTML = `
                <h1>Hotel encontrado:</h1>
                <p><spam>Título:</spam> ${hotel.titulo}</p>
                <p><spam>avaliacao:</spam> ${hotel.avaliacao}</p>
                <p><spam>Descrição:</spam> ${hotel.descricao}</p>
                <p><spam>Local:</spam> ${hotel.local}</p>
                <p><spam>${hotel.latitude}-${hotel.longitude}</spam> </p>
                <button class="btnDeletar" data-item-id="${hotel.titulo}" data-item-avaliacao="${hotel.avaliacao}" data-item-descricao="${hotel.descricao}" data-item-local="${hotel.local}" data-item-latitude="${hotel.latitude}" data-item-longitude="${hotel.longitude}">Deletar</button>
                <button class="btnAlterar" data-item-id="${hotel.titulo}" data-item-avaliacao="${hotel.avaliacao}" data-item-descricao="${hotel.descricao}" data-item-local="${hotel.local}" data-item-latitude="${hotel.latitude}" data-item-longitude="${hotel.longitude}">Alterar</button>
            `;


            resultadosDiv.scrollIntoView({ behavior: 'smooth' });
            listagem('');

        } else {
            console.log('Hotel não encontrado.');

            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.style.display = 'block';
            resultadosDiv.innerHTML = `
            <h1>Nenhum hotel encontrado com este nome</h1>`
            resultadosDiv.scrollIntoView({ behavior: 'smooth' });
            listagem('');
        }
    } catch (error) {
        console.error('Erro ao buscar hotel:', error);
    }
}

document.getElementById('btnBuscar').addEventListener('click', () => {
    const tituloBusca = document.getElementById('campoBusca').value;
    buscar(tituloBusca);
});

