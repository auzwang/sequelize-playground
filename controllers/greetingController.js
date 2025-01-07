/**
  * Greeting controller to handle greeting-related logic
  */

// Get greeting for Michael
exports.greetMichael = (req, res) => {
    try {
        res.json({
            message: "Hello Michael",
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error generating greeting",
            error: error.message
        });
    }
};

// Generic greeting handler
exports.greet = (req, res) => {
    try {
        const name = req.params.name || 'World';
        res.json({
            message: `Hello ${name}`,
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error generating greeting",
            error: error.message
        });
    }
};
