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
            title: "① Default Router Admin Password",
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
            title: "② Weak Wi-Fi Password or Encryption",
            why: "Using an outdated protocol like WEP or a weak, guessable password with WPA2 allows attackers to crack your password. Once they have it, they can connect to your network and see everything you do online.",
            howToCheck: `
                <p>Let's check your Wi-Fi security settings. This is a two-part check.</p>
                
                <h4>Part 1: Check Your Encryption Type</h4>
                <ol>
                    <li>On your phone or computer, go into your Wi-Fi settings.</li>
                    <li>Find your network name (SSID) and look at the security information. What does it say?
                        <br><br>
                        <select id="securityProtocolSelect">
                            <option value="">-- Please Select --</option>
                            <option value="WPA3">WPA3 (Most Secure)</option>
                            <option value="WPA2">WPA2 (Secure)</option>
                            <option value="WPA">WPA (Outdated)</option>
                            <option value="WEP">WEP (Very Insecure)</option>
                            <option value="Open">Open/None (Extremely Insecure)</option>
                        </select>
                        <button onclick="assessEncryption()">Check Encryption</button>
                    </li>
                </ol>
                <div id="encryptionResult"></div>
                <h4>Part 2: Assess Your Password Strength</h4>
                <p>Think about your current Wi-Fi password. How would you describe it?</p>
                <button onclick="assessPasswordStrength('weak')">Short, common word, or simple pattern</button>
                <button onclick="assessPasswordStrength('strong')">Long, random mix of letters, numbers, and symbols</button>
                <br><br>
                <div id="passwordResult"></div>
            `,
            howToFix: `
                <div id="encryptionFix"></div>
                <div id="passwordFix"></div>
                
                <p><strong>How to change your Wi-Fi password and encryption:</strong></p>
                <ol>
                    <li>Log into your router's admin panel using its IP address.</li>
                    <li>Navigate to the <b>Wireless</b>, <b>Wi-Fi</b>, or <b>Security</b> settings section.</li>
                    <li>Find the <b>Security Mode</b> or <b>Encryption</b> setting.
                        <ul>
                            <li>Select <b>WPA3-Personal</b> if it's available (best).</li>
                            <li>If not, select <b>WPA2-Personal (AES)</b> (good).</li>
                            <li>Never select WEP, WPA, or "None".</li>
                        </ul>
                    </li>
                    <li>In the <b>Password</b> (also called Network Key/Passphrase/Pre-Shared Key) field, enter your new, strong password.</li>
                    <li>Save the settings. Your router will likely restart, disconnecting all devices.</li>
                    <li>Reconnect all your devices (phones, laptops, TVs) using the new password.</li>
                </ol>
                <p><strong>Tip:</strong> Use a password manager to generate and remember a strong, random password for your Wi-Fi.</p>
            `
        },
        // Phase 1- Issue 3：Open Wifi Network:
        { 
        phase: 1,
        title: "③ Open Wifi Network",
        why: "our network has no password, allowing anyone nearby to connect. This means they can use your internet for illegal activities (which would be traced back to you), but more importantly, they can easily see everything you do online—every website, every password you type—because your data is sent without any encryption.",
        howToCheck: `
            <p>This is the easiest check to perform.</p>
            <ol>
                <li>On your phone, computer, or tablet, open the list of available Wi-Fi networks.</li>
                <li>Look for your network name (SSID).</li>
                <li><strong>What is shown next to it?</strong>
                    <br>
                    <button onclick="checkOpenWifi('lock')">A lock icon 🔒</button>
                    <button onclick="checkOpenWifi('unlocked')">No icon, or it says "Unsecured"</button>
                </li>
            </ol>
            <div id="openWifiResult"></div>
        `,
        howToFix: `
            <p style="color: red; font-weight: bold;">This is a critical issue that you should fix immediately.</p>
            <ol>
                <li>Log into your router's admin panel using the instructions from the first issue.</li>
                <li>Navigate to the <b>Wireless</b>, <b>Wi-Fi</b>, or <b>Security</b> settings section.</li>
                <li>Find the <b>Security Mode</b> or <b>Encryption</b> setting.</li>
                <li>Select <strong>WPA2-Personal (AES)</strong> or <strong>WPA3-Personal</strong> if available. <em>Do not select WEP or "None".</em></li>
                <li>In the <b>Password</b>, <b>Passphrase</b>, or <b>Pre-Shared Key</b> field, enter a <strong>strong new password</strong>. Make it at least 12 characters long, with a mix of upper and lowercase letters, numbers, and symbols.</li>
                <li>Save the settings. Your router will restart. All your devices will be disconnected.</li>
                <li>Reconnect your devices to the Wi-Fi using the new password you just set.</li>
            </ol>
        `
        },
        // Phase 1- Issue 4：Unencrypted Admin Access (HTTP):
        { 
        phase: 1,
        title: "④ Unencrypted Router Login/Admin Access (HTTP)",
        why: "When you log into your router using 'http://', your username and password are sent over your network in plain text. It's like shouting your password across your house. Anyone else connected to your Wi-Fi could easily capture it with simple software and then take full control of your router.",
        howToCheck: `
            <p>Let's see if your router supports a secure login.</p>
            <ol>
                <li>Open a web browser on a computer connected to your Wi-Fi.</li>
                <li>Type your router's IP address (most commonly, <code>192.168.1.1, 192.168.0.1, 192.168.50.1 (Common for Google Nest Wifi), 10.0.0.1 (Common for Xfinity)</code>) into the address bar, but make sure to use <code>https://</code> at the beginning instead of <code>http://</code>.
                    <br>Example: <code>https://192.168.1.1</code>
                </li>
                <li>Press Enter and see what happens.
                    <br>
                    <button onclick="checkHttps('works')">It worked! I see a login page with a lock icon 🔒 in the address bar.</button>
                    <button onclick="checkHttps('fails')">It didn't work. I got an error or the page won't load.</button>
                </li>
            </ol>
            <div id="httpsResult"></div>
        `,
        howToFix: `
            <p>The solution depends on what you found in the check above.</p>
            <div id="httpsFixInstruction">
                <p><strong>If HTTPS worked:</strong> Congratulations! <span style="color: green;">Always use the <code>https://</code> URL with the lock icon</span> when accessing your router from now on. Bookmark it to remember.</p>
                <p><strong>If HTTPS failed:</strong> Your router may not support secure login. This is a significant security limitation.</p>
                <ul>
                    <li><strong>Best solution:</strong> Consider upgrading to a newer router that supports modern security standards like HTTPS admin access and WPA3.</li>
                    <li><strong>If you can't upgrade:</strong> Be extremely cautious. Only log into your router from a computer that is connected with an <strong>Ethernet cable</strong>, not over Wi-Fi. This makes it much harder for someone to intercept your password.</li>
                </ul>
            </div>
        `
        },

                // Phase 2 - Issue 1: Remote Management Enabled
        {
            phase: 2,
            title: "Remote Management Enabled",
            why: "This feature, sometimes called 'Admin from WAN', allows you to access your router's settings from anywhere on the internet. While convenient, it is extremely dangerous. It means hackers anywhere in the world can also try to break into your router's login page with automated tools.",
            howToCheck: `
                <p>Our system will now perform a quick check from our server to see if your router's admin panel is visible to the internet.</p>
                <button onclick="checkRemoteManagement()">Check for Remote Access</button>
                <div id="remoteManagementResult"></div>

                <p><strong>You can also check manually:</strong></p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Look for settings like <b>Remote Management</b>, <b>Admin from WAN</b>, <b>Cloud Access</b>, or <b>Remote Access</b>. These are often found in <i>Administration</i>, <i>System</i>, or <i>Advanced</i> settings.</li>
                    <li>See if the feature is turned <span style="color: red;"><b>ON</b></span>.</li>
                </ol>
            `,
            howToFix: `
                <div id="remoteManagementFix"></div>
                <p><strong>How to disable it:</strong></p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Navigate to the <b>Remote Management</b>, <b>Admin from WAN</b>, or <b>Cloud Access</b> settings.</li>
                    <li><span style="color: red; font-weight: bold;">Disable</span> the feature. Ensure it is turned <b>OFF</b>.</li>
                    <li>Save the settings.</li>
                </ol>
                <p><strong>Need remote access?</strong> A much safer alternative is to set up a VPN (Virtual Private Network) on your home network. This creates a secure tunnel into your network without exposing your router's admin page to the entire world.</p>
            `
        },
        // Phase 2 - Issue 2: Unnecessary Services & Open Ports
        {
            phase: 2,
            title: "Unnecessary Services & Open Ports",
            why: "Routers run services that can accept connections. Some, like UPnP (Universal Plug and Play), are convenient for gaming and devices but can be tricked by malware on your network into opening doors for attackers. Others, like Telnet or old FTP, are never safe to have enabled as they send passwords in plain text.",
            howToCheck: `
                <p>Checking this requires looking inside your router's settings.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Look for sections named <b>UPnP</b>, <b>NAT Forwarding</b>, <b>Firewall</b>, or <b>Services</b>.</li>
                    <li>See if <b>UPnP</b> is enabled. (It often is by default).</li>
                    <li>Look for any other services like <b>Telnet</b>, <b>SSH</b>, or <b>FTP</b> and see if they are enabled, especially for access from the "WAN" or "Internet".</li>
                </ol>
                <p>What did you find?</p>
                <button onclick="assessServices('upnpOn')">UPnP is ON</button>
                <button onclick="assessServices('otherOn')">Other risky services are ON (Telnet/FTP)</button>
                <button onclick="assessServices('allOff')">Everything looks off or I'm not sure</button>
                <div id="servicesResult"></div>
            `,
            howToFix: `
                <div id="servicesFix"></div>
                <p><strong>General guide to disable services:</strong></p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Find the settings for <b>UPnP</b>, <b>Telnet</b>, <b>FTP</b>, etc.</li>
                    <li>Disable any services you do not absolutely need. It is generally safest to <span style="color: red; font-weight: bold;">disable UPnP</span> unless you have devices (like certain game consoles) that will not work without it.</li>
                    <li>If you find port forwarding rules you don't recognize, delete them.</li>
                    <li>Save the settings. Your router may restart.</li>
                </ol>
            `
        },
        // Phase 2 - Issue 3: Outdated Router Firmware
        {
            phase: 2,
            title: "Outdated Router Firmware",
            why: "Firmware is your router's operating system. Like any software, it can have security holes. Router manufacturers release updates to patch these vulnerabilities. If you don't update, you are leaving known doors unlocked for hackers to walk through.",
            howToCheck: `
                <p>Let's see if your router is up to date.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Find a section called <b>Firmware Update</b>, <b>Administration</b>, or <b>Advanced</b>.</li>
                    <li>Note the <b>Firmware Version</b> or <b>Software Version</b> number listed.</li>
                    <li>Look for a button that says <b>Check for Updates</b> or <b>Upgrade</b>. (Don't click it yet!).</li>
                </ol>
                <p>What is the status?</p>
                <button onclick="assessFirmware('updateAvailable')">It says an update is available</button>
                <button onclick="assessFirmware('upToDate')">It says it's up to date</button>
                <button onclick="assessFirmware('manualCheck')">I need to check the manufacturer's website</button>
                <div id="firmwareResult"></div>
            `,
            howToFix: `
                <div id="firmwareFix"></div>
                <p><strong>How to update your firmware:</strong></p>
                <ol>
                    <li><strong>Important:</strong> The update process can take several minutes. <span style="color: red; font-weight: bold;">Do not turn off the router or close the browser during the update!</span> This can permanently break the router.</li>
                    <li>In your router's admin panel, in the <b>Firmware Update</b> section, click the <b>Upgrade</b> or <b>Update</b> button.</li>
                    <li>Let the process complete. The router will reboot automatically.</li>
                    <li>If your router doesn't have an auto-update feature, you will need to:
                        <ol>
                            <li>Visit the manufacturer's support website on a computer.</li>
                            <li>Find the download page for your exact router model.</li>
                            <li>Download the latest firmware file.</li>
                            <li>Go back to your router's admin panel and use the "Manual Update" or "Browse" button to select the downloaded file and start the update.</li>
                        </ol>
                    </li>
                </ol>
            `
        },
        // Phase 2 - Issue 4: Hijacked Internet Settings (DNS)
        {
            phase: 2,
            title: "Hijacked Internet Settings (DNS)",
            why: "DNS is the internet's phonebook; it turns a website name (like google.com) into an IP address. If a hacker changes your router's DNS settings, they can redirect you to perfect-looking fake versions of banks, email, or social media sites to steal your passwords, even if you type the correct address.",
            howToCheck: `
                <p>Let's check your router's DNS settings for tampering.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Navigate to the <b>Internet</b>, <b>WAN</b>, or <b>Network</b> settings section.</li>
                    <li>Look for fields labeled <b>DNS Address</b> or <b>DNS Server</b>. They might be set to 'Automatic' or have numbers manually entered.</li>
                    <li>If there are manual entries, what are the numbers?
                        <br>Primary DNS: <input type="text" id="primaryDnsInput" placeholder="e.g., 8.8.8.8">
                        <br>Secondary DNS: <input type="text" id="secondaryDnsInput" placeholder="e.g., 1.1.1.1">
                    </li>
                </ol>
                <button onclick="checkDns()">Check DNS Servers</button>
                <div id="dnsResult"></div>
            `,
            howToFix: `
                <div id="dnsFix"></div>
                <p><strong>How to fix your DNS settings:</strong></p>
                <ol>
                    <li>In your router's admin panel, go to the <b>DNS Settings</b>.</li>
                    <li>If you found unknown DNS servers, change the setting back to <b>Automatic</b> (usually safest) or manually set them to trusted servers like:
                        <ul>
                            <li><b>Cloudflare:</b> <code>1.1.1.1</code> and <code>1.0.0.1</code></li>
                            <li><b>Google:</b> <code>8.8.8.8</code> and <code>8.8.4.4</code></li>
                            <li><b>OpenDNS:</b> <code>208.67.222.222</code> and <code>208.67.220.220</code></li>
                        </ul>
                    </li>
                    <li>Save the settings. You may need to reboot your router.</li>
                </ol>
            `
        },
        // Phase 3- Issue 1: WPS (Wi-Fi Protected Setup) Enabled
        {
            phase: 3,
            title: "WPS (Wi-Fi Protected Setup) Enabled",
            why: "WPS is the 'push-button' or PIN-based connection feature on your router. It has a critical design flaw: the PIN can be easily brute-forced by an attacker. This means even if you have a strong Wi-Fi password, a hacker can recover it in a few hours by cracking the WPS PIN, bypassing your security entirely.",
            howToCheck: `
                <p>We need to check your router's settings for the WPS feature.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Navigate to the <b>Wireless</b>, <b>Wi-Fi</b>, or <b>WPS</b> settings section. It might be under an <i>Advanced</i> menu.</li>
                    <li>Look for a setting named <b>WPS</b>, <b>Wi-Fi Protected Setup</b>, or <b>WPS Push Button</b>.</li>
                    <li>Check if the feature is enabled. There might also be a PIN listed.</li>
                </ol>
                <p>What is the status of WPS?</p>
                <button onclick="assessWps('enabled')">WPS is Enabled</button>
                <button onclick="assessWps('disabled')">WPS is Disabled</button>
                <button onclick="assessWps('unsure')">I Can't Find The Setting</button>
                <div id="wpsResult"></div>
            `,
            howToFix: `
                <div id="wpsFix"></div>
                <p><strong>How to disable WPS:</strong></p>
                <ol>
                    <li>In your router's admin panel, find the <b>WPS</b> settings page.</li>
                    <li>Find the toggle or checkbox for enabling WPS and <span style="color: red; font-weight: bold;">disable it</span>. It may be called "Enable WPS", "WPS Settings", etc.</li>
                    <li>If there is an option to <b>disable the PIN method</b> but keep the push-button, it is still safer to disable the entire feature.</li>
                    <li>Save the settings. Your router may apply the changes immediately.</li>
                </ol>
                <p><strong>Note:</strong> After disabling WPS, you will need to connect new devices to your Wi-Fi by manually entering the password instead of using the push-button. This is a small price to pay for a significant security upgrade.</p>
            `
        },
        // Phase 3 - Issue 2: Guest Network Not in Use
        {
            phase: 3,
            title: "Guest Network Not in Use",
            why: "All your devices are on one network. This means your personal laptop, your phone, your smart TV, and a visitor's potentially malware-ridden phone are all able to see and communicate with each other. A compromised device can be used to attack your more important devices. A Guest Network isolates guest traffic, protecting your core devices.",
            howToCheck: `
                <p>Let's see if you are using your router's built-in Guest Network feature.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Look for a section called <b>Guest Network</b>, <b>Guest Access</b>, or <b>Isolated Network</b>. This is usually found in the main <i>Wireless</i> settings.</li>
                    <li>See if the Guest Network is <b>Enabled</b>.</li>
                    <li>If it is, does it have a password? Is the isolation feature turned on?</li>
                </ol>
                <p>Do you have a Guest Network set up?</p>
                <button onclick="assessGuestNetwork('notEnabled')">No, I don't have one / it's disabled</button>
                <button onclick="assessGuestNetwork('enabled')">Yes, it's enabled and I use it</button>
                <div id="guestNetworkResult"></div>
            `,
            howToFix: `
                <div id="guestNetworkFix"></div>
                <p><strong>How to set up a secure Guest Network:</strong></p>
                <ol>
                    <li>In your router's admin panel, navigate to the <b>Guest Network</b> section.</li>
                    <li><b>Enable</b> the Guest Network.</li>
                    <li>Give it a clear name (SSID) like "<i>YourNetworkName-Guest</i>".</li>
                    <li><strong>Set a strong password for it.</strong> This can be different from your main Wi-Fi password.</li>
                    <li><strong>Crucially, look for an option called</strong> <b>"Client Isolation"</b>, <b>"AP Isolation"</b>, or <b>"Allow guests to see each other and access my local network"</b>.
                        <ul>
                            <li>You want to <b>ENABLE</b> Isolation. This prevents guests from seeing each other.</li>
                            <li>You want to <b>DISABLE</b> local network access. This prevents guests from seeing your personal devices (computers, printers, NAS).</li>
                        </ul>
                    </li>
                    <li>Save the settings. A new Wi-Fi network will appear for your guests.</li>
                </ol>
                <p>Use this network for visitors and all your Internet of Things (IoT) devices like smart plugs, TVs, and cameras. Keep your personal devices on your main network.</p>
            `
        },
        // Phase 3 - Issue 3: Unauthorized Devices on Your Network
        {
            phase: 3,
            title: "Unauthorized Devices on Your Network",
            why: "If an attacker guesses your password or exploits a weakness, they can connect to your network. From there, they can spy on your activity, attack your devices, or use your internet for illegal activities. Regularly checking for unknown devices helps you catch an intruder.",
            howToCheck: `
                <p>This check involves looking at the list of devices currently connected to your router.</p>
                <ol>
                    <li>Log into your router's admin panel.</li>
                    <li>Look for a section called <b>Attached Devices</b>, <b>DHCP Client List</b>, <b>Network Map</b>, or <b>Connected Devices</b>.</li>
                    <li>You will see a list of device names and their IP/MAC addresses. This list can be confusing because device names are often weird (e.g., 'android-3849fbc2a92d').</li>
                    <li>The best way to check is to <strong>identify every device you own.</strong> Unplug smart devices one by one and see which names disappear from the list.</li>
                </ol>
                <p>After identifying your devices, what's left?</p>
                <button onclick="assessDevices('allKnown')">I recognize all devices</button>
                <button onclick="assessDevices('unknownFound')">There is a device I can't identify</button>
                <div id="devicesResult"></div>
            `,
            howToFix: `
                <div id="devicesFix"></div>
                <p><strong>What to do if you find an unknown device:</strong></p>
                <ol>
                    <li><strong>Don't panic.</strong> It could be a device you forgot about, like a smart bulb or a new phone with a random name.</li>
                    <li><strong>The most effective action is to change your Wi-Fi password immediately.</strong> This will disconnect EVERY device from your network.</li>
                    <li>After changing the password, only reconnect your <em>trusted</em> devices.</li>
                    <li>If the unknown device reappears after this, it means it has been given the new password, indicating a serious breach of a trusted device.</li>
                    <li>Some routers let you <b>block</b> a device by its MAC address. This is a temporary fix, as a sophisticated attacker can change their MAC address.</li>
                </ol>
                <p>The best defense is a strong, unique password and WPA2/WPA3 encryption to prevent unauthorized access in the first place.</p>
            `
        }
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

        // Helper for assessing encryption type
    window.assessEncryption = function() {
        const selection = document.getElementById('securityProtocolSelect').value;
        const resultDiv = document.getElementById('encryptionResult');
        const fixDiv = document.getElementById('encryptionFix'); // For the fix section

        if (!selection) {
            resultDiv.innerHTML = `<p>Please select an option from the list.</p>`;
            return;
        }

        let message = "";
        let fixMessage = "";
        let color = "black";

        switch(selection) {
            case "WPA3":
                message = "✅ Excellent! You are using the latest and most secure encryption (WPA3).";
                color = "green";
                fixMessage = "<p>Your encryption is already the best available. No need to change it.</p>";
                break;
            case "WPA2":
                message = "🟡 Good. WPA2 is still secure, but consider upgrading to WPA3 if your router supports it. See  <a href='https://easytechsolver.com/how-do-i-configure-my-router-to-use-wpa3/' target='_blank' rel='noopener'>this guide</a>.";
                color = "orange";
                fixMessage = "<p>Your encryption is secure. You can check your router settings to see if WPA3 is an available option for a future upgrade.</p>";
                break;
            case "WPA":
                message = "🟠 Outdated. WPA is old and has known vulnerabilities. You should upgrade. See <a href='https://easytechsolver.com/how-do-i-configure-my-router-to-use-wpa3/' target='_blank' rel='noopener'>this guide</a>.";
                color = "darkorange";
                fixMessage = "<p style='color: darkorange;'><b>Recommendation:</b> You should change your encryption setting from WPA to <b>WPA2 (AES)</b> or <b>WPA3</b> in your router's settings.</p> See https://easytechsolver.com/how-do-i-configure-my-router-to-use-wpa3/.";
                break;
            case "WEP":
                message = "🔴 Critical Risk! WEP is extremely insecure and can be cracked in minutes. You must change this immediately. See  <a href='https://easytechsolver.com/how-do-i-configure-my-router-to-use-wpa3/' target='_blank' rel='noopener'>this guide</a>.";
                color = "red";
                fixMessage = "<p style='color: red;'><b>Urgent:</b> You must change your encryption setting from WEP to <b>WPA2 (AES)</b> or <b>WPA3</b> immediately.</p>";
                break;
            case "Open":
                message = "🔴 Critical Risk! Your network has no password. Anyone can connect and see everything you do.";
                color = "red";
                fixMessage = "<p style='color: red;'><b>Urgent:</b> You must enable encryption immediately. Set it to <b>WPA2 (AES)</b> or <b>WPA3</b> and create a strong password.</p> See <a href='https://easytechsolver.com/how-do-i-configure-my-router-to-use-wpa3/' target='_blank' rel='noopener'>this guide</a>.";
                break;
        }
        resultDiv.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

    // Helper for assessing password strength
    window.assessPasswordStrength = function(strength) {
        const resultDiv = document.getElementById('passwordResult');
        const fixDiv = document.getElementById('passwordFix'); // For the fix section

        let message = "";
        let fixMessage = "";
        let color = "black";

        if (strength === 'weak') {
            message = "🔴 Your password is likely weak and vulnerable to being guessed or cracked.";
            color = "red";
            fixMessage = "<p style='color: red;'><b>Recommendation:</b> You must change your Wi-Fi password to a stronger one. A strong password should be at least 12 characters long and include a random mix of upper and lowercase letters, numbers, and symbols. For example: <code>J7$mJ2@8L9!qP6z</code></p>";
        } else if (strength === 'strong') {
            message = "✅ Great! A strong, random password is your first line of defense.";
            color = "green";
            fixMessage = "<p>Your password strength is good. You only need to change it if you also have a problem with your encryption type above, or if you think the password might have been shared too widely.</p>";
        }

        resultDiv.innerHTML = `<p style="color: ${color}; font-weight: bold;">${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

     // Helper for Open Wi-Fi Check
    window.checkOpenWifi = function(status) {
        const resultDiv = document.getElementById('openWifiResult');
        if (status === 'unlocked') {
            resultDiv.innerHTML = `<p style="color: red;">⚠️ Your network is open and unsecured. This is a critical risk.</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color: green;">✅ Good! Your network is password-protected.</p>`;
        }
    }

    // Helper for HTTPS Check
    window.checkHttps = function(status) {
        const resultDiv = document.getElementById('httpsResult');
        if (status === 'works') {
            resultDiv.innerHTML = `<p style="color: green;">✅ Excellent! Your router supports secure (HTTPS) login. Always use it.</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">⚠️ Your router may not support a secure login page. This is a security risk.</p>`;
        }
    }

        // Helper for Remote Management Check (Simulated)
    window.checkRemoteManagement = function() {
        const resultDiv = document.getElementById('remoteManagementResult');
        const fixDiv = document.getElementById('remoteManagementFix');
        // This is a simulation. A real version would call your backend.
        resultDiv.innerHTML = `<p>🔍 Checking... (This is a simulation. A real check would run on our server).</p>`;
        
        setTimeout(() => {
            // Simulate a random result for demo purposes
            const isOpen = Math.random() > 0.5;
            if (isOpen) {
                resultDiv.innerHTML = `<p style="color: red; font-weight: bold;">⚠️ Warning: Our check found that your router's admin panel might be accessible from the internet. This is a critical risk.</p>`;
                if (fixDiv) {
                    fixDiv.innerHTML = `<p style="color: red;">You should disable Remote Management immediately.</p>`;
                }
            } else {
                resultDiv.innerHTML = `<p style="color: green;">✅ Good! Our check did not find your router's admin panel exposed to the open internet.</p>`;
                if (fixDiv) {
                    fixDiv.innerHTML = `<p>No action required for this issue.</p>`;
                }
            }
        }, 1500);
    }

    // Helper for Services Assessment
    window.assessServices = function(status) {
        const resultDiv = document.getElementById('servicesResult');
        const fixDiv = document.getElementById('servicesFix');

        let message = "";
        let fixMessage = "";

        switch(status) {
            case 'upnpOn':
                message = "🟠 UPnP is convenient but is a known security risk. It can be exploited by malware on your network. It is recommended to turn it off.";
                fixMessage = "<p><b>Recommendation:</b> Disable UPnP in your router's settings. If you later find a device (like a game console) doesn't work, you can re-enable it, but be aware of the risk.</p>";
                break;
            case 'otherOn':
                message = "🔴 Critical Risk! Services like Telnet or FTP are extremely insecure when exposed. They send passwords in plain text and should be disabled immediately.";
                fixMessage = "<p style='color: red;'><b>Urgent:</b> Disable Telnet, FTP, or any other unused services in your router's settings immediately.</p>";
                break;
            case 'allOff':
                message = "✅ Good! Leaving unnecessary services disabled is a great security practice.";
                fixMessage = "<p>No action required for this issue. Keep up the good practice!</p>";
                break;
        }
        resultDiv.innerHTML = `<p>${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

    // Helper for Firmware Assessment
    window.assessFirmware = function(status) {
        const resultDiv = document.getElementById('firmwareResult');
        const fixDiv = document.getElementById('firmwareFix');

        let message = "";
        let fixMessage = "";

        switch(status) {
            case 'updateAvailable':
                message = "🟠 An update is available. You should install it to patch known security vulnerabilities.";
                fixMessage = "<p><b>Action Needed:</b> Proceed with the update following the instructions in the 'How to Fix' section. Remember not to power off the router!</p>";
                break;
            case 'upToDate':
                message = "✅ Excellent! Your router's firmware is up to date. This is a key part of staying secure.";
                fixMessage = "<p>No action required for this issue. Check again in a few months.</p>";
                break;
            case 'manualCheck':
                message = "🔍 It's a good idea to manually check the manufacturer's website every 3-6 months for updates, as the auto-check isn't always perfect.";
                fixMessage = `<p><b>Action Needed:</b> 
                    <ol>
                        <li>Find your router's model number (on the sticker).</li>
                        <li>Go to the manufacturer's support website (e.g., support.netgear.com, tp-link.com/support).</li>
                        <li>Search for your model and download the latest firmware file.</li>
                        <li>Use the "Manual Update" feature in your router's admin panel to upload and install the file.</li>
                    </ol>
                </p>`;
                break;
        }
        resultDiv.innerHTML = `<p>${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

    // Helper for DNS Check
    window.checkDns = function() {
        const primaryDns = document.getElementById('primaryDnsInput').value;
        // const secondaryDns = document.getElementById('secondaryDnsInput').value; // Could also check this
        const resultDiv = document.getElementById('dnsResult');
        const fixDiv = document.getElementById('dnsFix');

        // List of some known malicious or suspicious DNS providers
        const suspiciousDnsPatterns = /(\.|^)(dns|hijack|malicious|free)\.|^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^100\./i; // Simple pattern for example

        if (!primaryDns) {
            resultDiv.innerHTML = `<p>Please enter the primary DNS server address from your router.</p>`;
            return;
        }

        // Check against known good DNS (simplified check)
        const knownGoodDns = ['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1', '208.67.222.222', '208.67.220.220', '9.9.9.9'];
        
        if (knownGoodDns.includes(primaryDns)) {
            resultDiv.innerHTML = `<p style="color: green;">✅ The DNS server <code>${primaryDns}</code> is a trusted, well-known server (e.g., Google, Cloudflare). This is good.</p>`;
            fixDiv.innerHTML = "<p>No action required. Your DNS settings look safe.</p>";
        } else if (suspiciousDnsPatterns.test(primaryDns)) {
            resultDiv.innerHTML = `<p style="color: red; font-weight: bold;">⚠️ Warning! The DNS server <code>${primaryDns}</code> looks suspicious or is a private IP address. This could be a sign of DNS hijacking.</p>`;
            fixDiv.innerHTML = "<p style='color: red;'><b>Urgent:</b> You should change your DNS settings back to <b>Automatic</b> or manually set them to a trusted provider like Google (<code>8.8.8.8</code>) or Cloudflare (<code>1.1.1.1</code>).</p>";
        } else {
            resultDiv.innerHTML = `<p style="color: orange;">🟡 The DNS server <code>${primaryDns}</code> is not a major well-known provider. This doesn't necessarily mean it's malicious, but you should only use it if you explicitly chose and trust this provider.</p>`;
            fixDiv.innerHTML = "<p>If you did not manually set this DNS server, you should change it to a trusted provider or back to <b>Automatic</b>.</p>";
        }
    }
        // Helper for WPS Assessment
    window.assessWps = function(status) {
        const resultDiv = document.getElementById('wpsResult');
        const fixDiv = document.getElementById('wpsFix');

        let message = "";
        let fixMessage = "";

        switch(status) {
            case 'enabled':
                message = "🔴 Critical Risk! WPS is enabled on your router. This is a major security weakness that bypasses your strong password. You should disable it immediately.";
                fixMessage = "<p style='color: red;'><b>Urgent:</b> You must disable WPS in your router's settings to close this security hole.</p>";
                break;
            case 'disabled':
                message = "✅ Excellent! WPS is disabled. You have eliminated a significant attack vector on your network.";
                fixMessage = "<p>No action required. Your WPS settings are secure.</p>";
                break;
            case 'unsure':
                message = "🟠 If you cannot find the setting, it is safer to assume it might be on. Try searching online for '<i>[Your Router Model] disable WPS</i>' for specific instructions. Many routers have it enabled by default.";
                fixMessage = "<p><b>Action Needed:</b> Consult your router's manual or online support to find out how to locate and disable the WPS setting. It is an important step for security.</p>";
                break;
        }
        resultDiv.innerHTML = `<p>${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

    // Helper for Guest Network Assessment
    window.assessGuestNetwork = function(status) {
        const resultDiv = document.getElementById('guestNetworkResult');
        const fixDiv = document.getElementById('guestNetworkFix');

        let message = "";
        let fixMessage = "";

        switch(status) {
            case 'notEnabled':
                message = "🟡 You are not using a Guest Network. While not a critical flaw, it is a recommended best practice for security and privacy. It is especially important if you have many IoT devices or frequent visitors.";
                fixMessage = "<p><b>Recommendation:</b> It is highly recommended to set up and use your router's Guest Network feature for visitors and IoT devices to isolate them from your personal devices.</p>";
                break;
            case 'enabled':
                message = "✅ Perfect! Using a Guest Network is a great security habit. Ensure 'Client Isolation' is on and 'Local Network Access' is off for the best security.";
                fixMessage = "<p>No action required. You are already using a key security feature correctly.</p>";
                break;
        }
        resultDiv.innerHTML = `<p>${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }

    // Helper for Unknown Devices Assessment
    window.assessDevices = function(status) {
        const resultDiv = document.getElementById('devicesResult');
        const fixDiv = document.getElementById('devicesFix');

        let message = "";
        let fixMessage = "";

        switch(status) {
            case 'allKnown':
                message = "✅ Great! You have identified all devices on your network. This is a good security practice. Make it a habit to check this list every few months.";
                fixMessage = "<p>No immediate action required. Continue to monitor your connected devices list periodically.</p>";
                break;
            case 'unknownFound':
                message = "🔴 Take action. An unidentified device could be a neighbor using your Wi-Fi, a guest device you forgot about, or in a worst-case scenario, an intruder.";
                fixMessage = "<p style='color: red;'><b>Action Needed:</b> The most effective way to remove an unknown device is to <b>change your Wi-Fi password immediately</b>. This will disconnect all devices, allowing you to only reconnect those you trust.</p>";
                break;
        }
        resultDiv.innerHTML = `<p>${message}</p>`;
        if (fixDiv) {
            fixDiv.innerHTML = fixMessage;
        }
    }
    // Function to analyze the pasted script output
       // Function to analyze the pasted script output
    window.analyzeScriptOutput = function() {
        const output = document.getElementById('script-output').value;
        const resultDiv = document.getElementById('script-analysis-result');
        
        // Clear previous results
        resultDiv.innerHTML = "<h3>🔍 Automated Security Report</h3>";

        try {
            const data = JSON.parse(output); 
            let html = '';

            // --- Phase 1 Checks ---
            html += `<div class="result-box"><h4>🔒 Phase 1: Critical Settings</h4>`;

            // Check 1: Remote Management (Open Ports)
            if (data.openPorts && data.openPorts.length > 0) {
                html += `<p style="color: red; font-weight: bold;">❌ CRITICAL: Remote Management likely ENABLED (Ports ${data.openPorts.join(', ')} open)</p>`;
            } else {
                html += `<p style="color: green;">✅ Remote Management likely DISABLED</p>`;
            }

            // Check 2: Router Login Security (HTTP vs HTTPS)
            if (data.routerHttpsAccess === 'accessible') {
                html += `<p style="color: green;">✅ Secure Router Login (HTTPS) AVAILABLE</p>`;
            } else if (data.routerHttpAccess === 'accessible') {
                html += `<p style="color: red;">❌ Router Login INSECURE (HTTP only)</p>`;
            } else {
                html += `<p>⚠️ Could not automatically access router login page at ${data.gateway}</p>`;
            }

            // Check 3: Wi-Fi Encryption
            if (data.wifiEncryption && data.wifiEncryption.includes('WPA3')) {
                html += `<p style="color: green;">✅ Excellent Wi-Fi Encryption: ${data.wifiEncryption}</p>`;
            } else if (data.wifiEncryption && data.wifiEncryption.includes('WPA2')) {
                html += `<p style="color: green;">✅ Good Wi-Fi Encryption: ${data.wifiEncryption}</p>`;
            } else if (data.wifiEncryption && (data.wifiEncryption.includes('WPA') || data.wifiEncryption.includes('WEP'))) {
                html += `<p style="color: red;">❌ Outdated Wi-Fi Encryption: ${data.wifiEncryption}</p>`;
            } else if (data.wifiEncryption && data.wifiEncryption.includes('Open')) {
                html += `<p style="color: red;">❌ CRITICAL: Open Wi-Fi Network (No Password)</p>`;
            } else {
                html += `<p>🔍 Wi-Fi Encryption: Could not auto-detect (${data.wifiEncryption || 'Unknown'})</p>`;
            }
            html += `</div>`;

            // --- Network Information ---
            html += `<div class="result-box"><h4>🌐 Network Information</h4>`;
            html += `<p><b>Router IP:</b> <code>${data.gateway || 'Unknown'}</code> &nbsp;|&nbsp; <b>Public IP:</b> <code>${data.publicIP || 'Unknown'}</code></p>`;
            html += `<p><b>Wi-Fi Name (SSID):</b> ${data.wifiSSID || 'Unknown'}</p>`;
            html += `<p><b>Devices Detected:</b> ~${data.connectedDeviceCount || '0'} (Your computer can see this many)</p>`;
            html += `</div>`;

            // --- Action Plan ---
            html += `<div class="result-box"><h4>📋 Your Action Plan</h4>`;
            html += `<p>Based on this scan, here are your next steps:</p><ul>`;

            if (data.openPorts && data.openPorts.length > 0) {
                html += `<li><b>URGENT:</b> Disable <i>Remote Management</i> in your router settings.</li>`;
            }
            if (data.routerHttpAccess === 'accessible' && data.routerHttpsAccess !== 'accessible') {
                html += `<li><b>Important:</b> Always use <code>https://${data.gateway}</code> to log into your router.</li>`;
            }
            if (data.wifiEncryption && (data.wifiEncryption.includes('WEP') || data.wifiEncryption.includes('Open'))) {
                html += `<li><b>URGENT:</b> Change your Wi-Fi encryption to WPA2 or WPA3.</li>`;
            }

            html += `<li><b>Complete the audit:</b> Log into your router at <code>${data.gateway || '192.168.1.1'}</code> to check for default passwords and other settings this scan can't see.</li>`;
            html += `</ul>`;
            html += `<br><button onclick="location.reload()">Start Full Guided Checkup for Default Passwords & More</button>`;
            html += `</div>`;

            resultDiv.innerHTML += html;

        } catch (e) {
            resultDiv.innerHTML += `<p>Could not parse the script output. Please ensure you copied the entire text correctly.</p><pre>${output}</pre>`;
        }
    }

    // New function to simulate a more thorough public IP check
    window.checkPublicIp = function(ip) {
        alert(`This would run a more advanced check on IP: ${ip}\n\nIn a full version, this would be a separate script or use a secure API to probe for open ports on your public IP.`);
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
    


