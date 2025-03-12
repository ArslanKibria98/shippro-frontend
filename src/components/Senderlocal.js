import { useState, useEffect } from "react";

const SenderForm = () => {
  const [sender, setSender] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [savedSender, setSavedSender] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    // Load saved sender from localStorage
    const storedSender = localStorage.getItem("savedSender");
    if (storedSender) {
      setSavedSender(JSON.parse(storedSender));
    }
  }, []);

  

  const handleInputChange = (e) => {
    setSender({ ...sender, [e.target.name]: e.target.value });
  };

  const handleSaveSender = () => {
    localStorage.setItem("savedSender", JSON.stringify(sender));
    setSavedSender(sender);
    alert("Sender saved for later use!");
  };

  const handleFillSender = () => {
    if (savedSender) {
      setSender(savedSender);
      setShowSuggestion(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sender Information</h2>

      <label className="block mb-2">Sender Name</label>
      <input
        type="text"
        name="name"
        value={sender.name}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestion(true)}
        className="w-full p-2 border rounded"
        placeholder="Enter sender name"
      />
      
      {showSuggestion && savedSender && (
        <div 
          className="mt-1 p-2 bg-gray-100 border cursor-pointer text-sm"
          onClick={handleFillSender}
        >
          Use saved sender: {savedSender.name}
        </div>
      )}

      <label className="block mt-3">Sender Address</label>
      <input
        type="text"
        name="address"
        value={sender.address}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        placeholder="Enter sender address"
      />

      <label className="block mt-3">Phone</label>
      <input
        type="text"
        name="phone"
        value={sender.phone}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        placeholder="Enter phone number"
      />

      <button
        onClick={handleSaveSender}
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
      >
        Save for Later
      </button>
    </div>
  );
};

export default SenderForm;
