const express = require("express")
const server = express()
const router = express.Router()
const fs = require('fs')
const uuid = require("uuid")

server.use(express.json({ extended: true }))

const readFile = () => {
    const content = fs.readFileSync('./data/items.json', 'utf-8')
    return JSON.parse(content)
}

const writeFile = (content) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./data/items.json', updateFile, 'utf-8')
}

router.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
})
router.get("/cardapio/:id", (req, res) => {
    try {
        const { id } = req.params;
        const currentContent = readFile();
        const selectedItem = currentContent.find((item) => item.id === id);

        res.send(selectedItem)
    } catch (error) {
        console.log(error)
    }
})

router.post('/', (req, res) => {
    const { nome, descricao, preco } = req.body
    const currentContent = readFile()
    const id = uuid.v4();
    currentContent.push({ id, nome, descricao, preco })
    writeFile(currentContent)
    res.send({ id, nome, descricao, preco })
})

router.put('/:id', (req, res) => {
    const { id } = req.params

    const { nome, descricao, preco } = req.body

    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)

    const { id: cId, nome: cNome, descricao: cDescricao, preco: cPreco } = currentContent[selectedItem]

    const newObject = {
        id: cId,
        nome: nome ? nome : cNome,
        descricao: descricao ? descricao : cDescricao,
        preco: preco ? preco : cPreco,
    }

    currentContent[selectedItem] = newObject
    writeFile(currentContent)

    res.send(newObject)
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item) => item.id === id)
    currentContent.splice(selectedItem, 1)
    writeFile(currentContent)
    res.send(true)
})

server.use(router)

server.listen(3000, () => {
    console.log('Rodando servidor')
})