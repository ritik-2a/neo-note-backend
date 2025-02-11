import Notes from "../models/notes.model.js";

export const createNote = async (req, res) => {
  const note = new Notes({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags || [],
    user: req.user._id,
  });

  try {
    const newNote = await note.save();
    res.status(201).json({ message: "Note created successfully", newNote });
  } catch (err) {
    res.status(400).json({ errors: `${err.message}` });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user._id });
    res.status(200).json({ message: "Fetch successful", notes });
    
  } catch (err) {
    res.status(401).json({ errors: `${err.message}` });
  }
};

export const updateNote = async (req, res) => {
  try {
    const updateNote = await Notes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated Successfully", updateNote });
  } catch (error) {
    res.status(401).json({ message: "Error in Updating" });
  }
};

export const delNote = async (req, res) => {
  try {
    const delt = await Notes.findByIdAndDelete(req.params.id);
    if (!delt) {
      res.status(404).json({ message: "Note not Found" });
    }

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(401).json({ message: "Error in deleting" });
  }
};

export const updatedPinned = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    // Ensure the logged-in user owns the note

    if (req.params.id !== note.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Cannot modify this note" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    return res
      .status(200)
      .json({ message: "Successfully updated pinned status", note });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
