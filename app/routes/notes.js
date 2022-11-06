var express = require('express');
var router = express.Router();
const Note = require('../models/note');
const withAuth = require("../middlewares/auth");
const { route } = require('express/lib/application');

router.post('/', withAuth, async(req, res) => {
    const { title, body } = req.body;
//cria uma nova nota com essas infos (o autor é do usuário request fornecido pelo middleware WithAuth)

    try {
        let note = new Note({ title, body, author: req.user._id })
        //tenta salvar a nota
        await note.save();
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ error: 'Problem to Create a new note' });
    }
})
router.get('/search', withAuth, async(req, res) => {
    const { query } = req.query;
    try {
        let notes = await Note
            .find({ author: req.user._id })
            .find({ $text: { $search: query } })
        res.json(notes)

    } catch (error) {
        res.json({ error }).status(500)
    }

})
router.get('/:id', withAuth, async(req, res) => {

    try {
        const { id } = req.params;
        let note = await Note.findById(id)
        if (isOwner(req.user, note)) {

            res.json(note);
        } else {
            res.status(403).json({ error: 'Permission denied' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Problem to get a note' });
    }
})

router.get('/', withAuth, async(req, res) => {
    try {

        let notes = await Note.find({ author: req.user._id })
        res.json(notes);

    } catch (err) {
        res.json({ err }).status(500)
    }
})

router.put('/:id', withAuth, async function(req, res) {
    const { title, body } = req.body;
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if (isOwner(req.user, note)) {
            var noteUpdate = await Note.findOneAndUpdate({ _id: id }, { $set: { title: title, body: body } }, { upsert: true, 'new': true })
            res.json(noteUpdate);
        } else {
            res.status(500).json({ error: 'Permission Denied' })
        }

    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', withAuth, async(req, res) => {
    const { id } = req.params;

    try {
        let note = await Note.findById(id);
        if (isOwner(req.user, note)) {
            await note.delete();
            res.json({ message: "Note Deleted" }).status(204)
        } else {
            res.status(500).json({ error: 'Permission Denied' })
        }

    } catch (err) {
        res.status(500).json({ error: 'Problem to Delete a note' })
    }
})

const isOwner = (user, note) => {
    if (JSON.stringify(user._id) == JSON.stringify(note.author._id)) {
        return true;
    } else {
        return false
    }
}

module.exports = router;