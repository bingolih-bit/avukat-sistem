const Deadline = require('../models/Deadline');

// Get all deadlines
exports.getAllDeadlines = async (req, res) => {
  try {
    const deadlines = await Deadline.find().sort({ sonGun: 1 });
    
    // Her süre için kalan günü yeniden hesapla
    const updatedDeadlines = deadlines.map(deadline => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const targetDate = new Date(deadline.sonGun);
      targetDate.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      deadline.kalanGun = diffDays;
      
      if (diffDays <= 3) {
        deadline.aciliyet = 'acil';
      } else if (diffDays <= 7) {
        deadline.aciliyet = 'yakin';
      } else {
        deadline.aciliyet = 'guvenli';
      }
      
      return deadline;
    });
    
    res.json(updatedDeadlines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new deadline
exports.createDeadline = async (req, res) => {
  const deadline = new Deadline(req.body);
  
  try {
    const newDeadline = await deadline.save();
    res.status(201).json(newDeadline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete deadline
exports.deleteDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndDelete(req.params.id);
    
    if (!deadline) {
      return res.status(404).json({ message: 'Süre bulunamadı' });
    }
    
    res.json({ message: 'Süre silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update deadline
exports.updateDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!deadline) {
      return res.status(404).json({ message: 'Süre bulunamadı' });
    }
    
    res.json(deadline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
