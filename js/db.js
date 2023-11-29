import { openDB } from "idb";

window.addEventListener('DOMContentLoaded', async event =>{
    criarDB();
    document.getElementById('btnCadastro').addEventListener('click', adicionarAnotacao);
    document.getElementById('btnCarregar').addEventListener('click', buscarTodasAnotacoes);
});

let db;

async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch (oldVersion){
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        console.log("Banco de dados criado!")
                }
            }
        })
        console.log("banco de dados aberto!");
    } catch (e) {
        console.log('Erro ao criar/abrir banco: ' + e.message);
    }
}
