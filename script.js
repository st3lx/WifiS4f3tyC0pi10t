document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const introSection = document.getElementById('intro');
    const navSection = document.getElementById('phase-navigation');
    const checkupSection = document.getElementById('checkup-steps');
    const scriptButton = document.getElementById('startScriptButton');
    const scriptSection = document.getElementById('script-results');
    // Phase content database
// Wait for the page to load
    // Define the checkup flow as an array of steps
    const checkupFlow = [
        // PHASE 1 - Issue 1: Default Router Password
        {
            phase: 1,
            title: "Default Router Admin Password",
            why: "This is the biggest risk. The username/password to the router's settings is still set to the manufacturer's default (e.g., admin/password). This gives an attacker full control of your network, allowing them to see everything you do online, infect your devices, or even lock you out.",
            howToCheck: `
                <p>We need to find your router's model number and check if it's using a default password.</p>
                <ol>
                    <li><strong>Find your router's IP address (Gateway):</strong>
                        <ul>
                            <li><b>Windows:</b> Open Command Prompt, type <code>ipconfig</code>, and look for "Default Gateway".</li>
                            <li><b>Mac:</b> Open System Settings > Network > Wi-Fi > Details... > TCP/IP. Look for "Router".</li>
                            <li><b>Phone:</b> Go to Wi-Fi settings, tap on your network, and look for "Gateway" or "Router".</li>
                        </ul>
                        Your router's IP is likely: <code>192.168.1.1</code>, <code>192.168.0.1</code>, or <code>10.0.0.1</code>.
                    </li>
                    <li><strong>Find your router's model number:</strong> It's almost always on a <strong>sticker on the router itself</strong> (on the back or bottom). Look for "Model No."</li>
                    <li><strong>Look up the default password:</strong> Enter your router's model number below and we'll check our database.
                        <br><br>
                        <input type="text" id="routerModelInput" placeholder="e.g., Netgear Nighthawk AX5400">
                        <button onclick="checkDefaultPassword()">Check Database</button>
                        <br>
                        <div id="defaultPasswordResult"></div>
                    </li>
                </ol>
            `,
            howToFix: `
                <p>If your router might be using a default password, you must change it immediately.</p>
                <ol>
                    <li>Open a web browser and type your router's IP address (from step 1) into the address bar. Press Enter.</li>
                    <li>You will see your router's login page. Try the default username and password for your model.</li>
                    <li>Once logged in, navigate to <b>Administration</b>, <b>Management</b>, or <b>Security</b> settings.</li>
                    <li>Find the option to change the <b>Router Password</b> or <b>Admin Password</b>.</li>
                    <li>Set a new, <strong>very strong password</strong>. Use a mix of letters, numbers, and symbols, or a long random passphrase. <em>Do not use your Wi-Fi password.</em></li>
                    <li>Save the settings. You will likely have to log in again with your new password.</li>
                </ol>
                <p><strong>Warning:</strong> Don't forget this new password! If you do, you will have to reset the router to factory settings, which will erase all your custom settings.</p>
            `
        },
        // PHASE 1 - Issue 2: Weak Wi-Fi Encryption
        {
            phase: 1,
            title: "Weak Wi-Fi Password or Encryption",
            why: "Using an outdated protocol like WEP or a weak, guessable password with WPA2 allows attackers to crack your password. Once they have it, they can connect to your network and see everything you do online.",
            howToCheck: `
                <p>Let's check your Wi-Fi security settings.</p>
                <ol>
                    <li>On your phone or computer, go into your Wi-Fi settings.</li>
                    <li>Find your network name (SSID) and look at the security information. What does it say?
                        <br>
                        <select id="securityProtocolSelect">
                            <option value="">-- Please Select --</option>
                            <option value="WPA3">WPA3</option>
                            <option value="WPA2">WPA2</option>
                            <option value="WPA">WPA</option>
                            <option value="WEP">WEP</option>
                            <option value="Open">Open/None</option>
                        </select>
                    </li>
                    <li>Think about your password. Is it a simple word, a name, or a short number sequence?
                        <br>
                        <button onclick="assessPasswordStrength()">My password is weak</button>
                        <button onclick="assessPasswordStrength()">My password is strong</button>
                    </li>
                </ol>
                <div id="encryptionResult"></div>
            `,
            howToFix: `... (content for fixing Wi-Fi) ...`
        },
        // Phase - Issue :
        { 
        phase: 1,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },

        // Phase 2 - Issue 2: Remote Management Enabled
        { 
        phase: 2,
        title: "Remote Management Enabled",
        why: "The router's admin panel is accessible...",
        howToCheck: "<p>Step 1: Your web app's backend can try...</p>",
        howToFix: "<p>Step 1: Guide the user to log in...</p>"
        },
        // Phase - Issue :
        { 
        phase: 2,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },
        // Phase - Issue :
        { 
        phase: 2,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },
        // Phase - Issue :
        { 
        phase: 3,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },
        // Phase - Issue :
        { 
        phase: 3,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },
        // Phase - Issue :
        { 
        phase: 3,
        title: "",
        why: "",
        howToCheck: "<p>Step 1: </p>",
        howToFix: "<p>Step 1:</p>"
        },
    ];

    let currentStepIndex = 0; // Keeps track of which issue we're on

    // Start button -> Show the first issue
    startButton.addEventListener('click', function() {
        introSection.style.display = 'none';
        navSection.style.display = 'block';
        checkupSection.style.display = 'block';
        loadCurrentStep(); // Load the first step in the flow
    });

        // Script button -> Show the script instructions
    scriptButton.addEventListener('click', function() {
        introSection.style.display = 'none';
        scriptSection.style.display = 'block'; // Show the script section
        // We hide the nav and regular checkup sections for this path
        navSection.style.display = 'none';
        checkupSection.style.display = 'none';
    });
    // Next/Prev Button Logic would go here later

    // Function to load the current step from the checkupFlow array
    function loadCurrentStep() {
        const currentStep = checkupFlow[currentStepIndex];
        checkupSection.innerHTML = `
            <h2>Phase ${currentStep.phase}: ${currentStep.title}</h2>
            <div class="why-box">
                <h3>❓ Why is this a problem?</h3>
                <p>${currentStep.why}</p>
            </div>
            <div class="check-box">
                <h3>🔍 How to Check</h3>
                ${currentStep.howToCheck}
            </div>
            <div class="fix-box">
                <h3>🛠️ How to Fix</h3>
                ${currentStep.howToFix}
            </div>
            <br>
            <button onclick="goToPreviousStep()">Previous</button>
            <button onclick="goToNextStep()">Next</button>
        `;
    }

    
    // Functions to navigate between steps (you need to implement these)
    window.goToNextStep = function() {
        if (currentStepIndex < checkupFlow.length - 1) {
            currentStepIndex++;
            loadCurrentStep();
        } else {
            // We've reached the end of the checkup!
            alert("Checkup complete! Your network is more secure.");
        }
    }

    window.goToPreviousStep = function() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            loadCurrentStep();
        }
    }

    // Function for the "Check Database" button (example stub)
    window.checkDefaultPassword = function() {
        const model = document.getElementById('routerModelInput').value;
        // In a real app, you would search your JSON database here.
        // For now, we'll just simulate a result.
        const resultDiv = document.getElementById('defaultPasswordResult');
        if (model.toLowerCase().includes('nighthawk')) {
            resultDiv.innerHTML = `<p style="color: red;">⚠️ Found it! Common defaults for this model are <code>admin/password</code>. You should change this.</p>`;
        } else if (model) {
            resultDiv.innerHTML = `<p>Could not find that model in our database. Please search online for "<strong>${model} default password</strong>".</p>`;
        } else {
            resultDiv.innerHTML = `<p>Please enter a model number.</p>`;
        }
    }

        // Function to copy the command to clipboard
    window.copyCommand = function(codeElement) {
        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('Command copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Function to analyze the pasted script output
    window.analyzeScriptOutput = function() {
        const output = document.getElementById('script-output').value;
        const resultDiv = document.getElementById('script-analysis-result');
        
        // Simple example parsing. You would make this much more robust.
        try {
            // Try to parse the output as JSON (if your script outputs JSON)
            const data = JSON.parse(output); 
            resultDiv.innerHTML = `<h3>Analysis Complete</h3>`;
            
            // Check for found issues based on the script's data
            if (data.gateway) {
                resultDiv.innerHTML += `<p>Found your router: ${data.gateway}</p>`;
            }
            if (data.openPorts && data.openPorts.length > 0) {
                resultDiv.innerHTML += `<p style="color: red;">⚠️ Warning: Open ports found: ${data.openPorts.join(', ')}. These could be a security risk.</p>`;
            } else {
                resultDiv.innerHTML += `<p>✅ Good! No critical open ports found from the outside.</p>`;
            }
            // Add more checks here based on what your script provides

        } catch (e) {
            // If it's not JSON, just show the raw output for now
            resultDiv.innerHTML = `<p>Received output. (In a real app, you would parse this for specific information):</p>
                                    <pre>${output}</pre>`;
        }
    }

    // New function to jump to the first step of a phase
function jumpToPhase(phaseNumber) {
    // Find the index of the first step in the requested phase
    const stepIndex = checkupFlow.findIndex(step => step.phase === phaseNumber);
    // If found, go to that step
    if (stepIndex !== -1) {
        currentStepIndex = stepIndex;
        loadCurrentStep();
    } else {
        alert("Phase not found!");
    }
}
    // Navigation buttons - Updated for Phase Jumping
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const phase = parseInt(this.dataset.phase); // Get the phase number as an integer
            jumpToPhase(phase); // Use the new jump function
        });
    });
    // ... other helper functions like assessPasswordStrength ...
});
    


