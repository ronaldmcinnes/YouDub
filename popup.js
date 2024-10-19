document.addEventListener('DOMContentLoaded', function () {
    const toggleDubbing = document.getElementById('toggleDubbing');
    const voiceSelect = document.getElementById('voiceSelect');
    const applyButton = document.getElementById('applyButton');
    const status = document.getElementById('status');

    // Populate voiceSelect with voices from Cartesia AI
    // For simplicity, we will hardcode some example voices
    const voices = [
        { name: 'Voice A', id: 'voice_a' },
        { name: 'Voice B', id: 'voice_b' },
        { name: 'Voice C', id: 'voice_c' }
    ];

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.id;
        option.textContent = voice.name;
        voiceSelect.appendChild(option);
    });

    // Load saved settings
    chrome.storage.sync.get(['dubbingEnabled', 'selectedVoice'], function (data) {
        toggleDubbing.checked = data.dubbingEnabled || false;
        voiceSelect.value = data.selectedVoice || voices[0].id;
    });

    applyButton.addEventListener('click', function () {
        const dubbingEnabled = toggleDubbing.checked;
        const selectedVoice = voiceSelect.value;

        // Save settings
        chrome.storage.sync.set({
            dubbingEnabled: dubbingEnabled,
            selectedVoice: selectedVoice
        }, function () {
            // Inform content script of the changes
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'applySettings',
                    dubbingEnabled: dubbingEnabled,
                    selectedVoice: selectedVoice
                });
            });
            status.textContent = 'Settings applied!';
            setTimeout(() => window.close(), 1000);
        });
    });
});

