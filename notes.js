"use strict";
class notesApp{
    constructor(){
        const notesFromStorage = localStorage.getItem("notes");
        this.notes = notesFromStorage ? JSON.parse(notesFromStorage) : [];
        this.history = [];

        this.form = document.getElementById("note-form");
        this.titleInput = document.getElementById("title");
        this.contentInput = document.getElementById("content");
        this.notesContainer = document.getElementById("notes-container");


        this.form.addEventListener("submit", event =>{
            event.preventDefault();
            const title = this.titleInput.value.trim();
            const content = this.contentInput.value.trim();
            
            if (this.editingId !== undefined) {
                this.updateNote(this.editingId, title, content, this.notesContainer);
                this.editingId = undefined; 
            } else {
                this.addNote(title, content, this.notesContainer);
            }

            this.titleInput.value = "";
            this.contentInput.value = "";
        })

        this.notesContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                const noteDiv = event.target.closest('.note');
                const id = Number(noteDiv.dataset.id);
                this.deleteNote(id, this.notesContainer);
            }
        })     

        this.notesContainer.addEventListener("click", event =>{
            if(event.target.classList.contains("edit-button")){
                const noteDiv = event.target.closest(".note");
                const id = Number(noteDiv.dataset.id);              
                this.editNote(id, this.notesContainer)
            }
        })
        
        this.notes.forEach(note =>{
            this.renderNote(note, this.notesContainer);
        })
    }

    commit(){
        this.history.push(JSON.parse(JSON.stringify(this.notes)));
        localStorage.setItem("notes", JSON.stringify(this.notes));
    }

    addNote(title,content, notesContainer){
        const note = {id: Date.now(), title, content, lastEdited: Date.now()};
        this.notes.push(note);
        this.commit();
        this.renderNote(note, notesContainer);
    }

    renderNote(note, notesContainer){
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";
        noteDiv.setAttribute("data-id", note.id);   

        const noteTitle = document.createElement("strong");
        noteTitle.textContent = note.title;

        const noteContent = document.createElement("p");
        noteContent.textContent = note.content;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-button';

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-button";

        noteDiv.appendChild(noteTitle);
        noteDiv.appendChild(noteContent);
        noteDiv.appendChild(deleteBtn);
        noteDiv.appendChild(editBtn);

        notesContainer.appendChild(noteDiv);
    }

    deleteNote(id, notesContainer){
        const noteDiv = notesContainer.querySelector(`[data-id="${id}"]`);
        if(noteDiv) notesContainer.removeChild(noteDiv);
        this.notes = this.notes.filter(note => note.id !== id);
        this.commit();
    }

    editNote(id, notesContainer){
        const noteDiv = notesContainer.querySelector(`[data-id="${id}"]`);
        const noteTitle = noteDiv.querySelector("strong").textContent;
        const noteContent = noteDiv.querySelector("p").textContent;

        this.titleInput.value = noteTitle;
        this.contentInput.value = noteContent;

        this.editingId = id;
    }

    updateNote(id, newTitle, newContent, notesContainer){
        const noteDiv = notesContainer.querySelector(`[data-id="${id}"]`);
        if (!noteDiv) return;

        const titleElement = noteDiv.querySelector("strong");
        const contentElement = noteDiv.querySelector("p");
        titleElement.textContent = newTitle;
        contentElement.textContent = newContent;

        const note = this.notes.find(n => n.id === id);
        if(note){
            note.title = newTitle;
            note.content = newContent;
            note.lastEdited = Date.now();
            this.commit();
        }

        
    }
}

const app = new notesApp();