// Compare page JavaScript with Toggle Support
const API_BASE_URL = window.location.origin;

// File storage
let fileA = null;
let fileB = null;

// Input mode tracking
let isTextMode = false;

// DOM elements
const uploadZoneA = document.getElementById('uploadZoneA');
const uploadZoneB = document.getElementById('uploadZoneB');
const fileInputA = document.getElementById('fileInputA');
const fileInputB = document.getElementById('fileInputB');
const fileInfoA = document.getElementById('fileInfoA');
const fileInfoB = document.getElementById('fileInfoB');
const compareBtn = document.getElementById('compareBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const newCompareBtn = document.getElementById('newCompareBtn');

// Text input elements
const textInputA = document.getElementById('textInputA');
const textInputB = document.getElementById('textInputB');
const charCountA = document.getElementById('charCountA');
const charCountB = document.getElementById('charCountB');

// Mode toggle
const inputModeToggle = document.getElementById('inputModeToggle');
const uploadMode = document.getElementById('uploadMode');
const textMode = document.getElementById('textMode');
const modeTextUpload = document.getElementById('modeTextUpload');
const modeTextPaste = document.getElementById('modeTextPaste');

// Toggle between file upload and text input modes
function toggleInputMode() {
    isTextMode = inputModeToggle.checked;

    if (isTextMode) {
        // Switch to text mode
        uploadMode.style.display = 'none';
        textMode.style.display = 'block';
        modeTextPaste.classList.add('active');
        modeTextUpload.classList.remove('active');
        updateCompareButtonForText();
    } else {
        // Switch to upload mode
        uploadMode.style.display = 'block';
        textMode.style.display = 'none';
        modeTextUpload.classList.add('active');
        modeTextPaste.classList.remove('active');
        updateCompareButton();
    }
}

// Update character count
function updateCharCount(textareaId, countId) {
    const textarea = document.getElementById(textareaId);
    const count = document.getElementById(countId);
    if (textarea && count) {
        count.textContent = textarea.value.length;
    }
}

// Update compare button for text mode
function updateCompareButtonForText() {
    if (!isTextMode) return;

    const hasTextA = textInputA && textInputA.value.trim().length > 0;
    const hasTextB = textInputB && textInputB.value.trim().length > 0;
    compareBtn.disabled = !(hasTextA && hasTextB);
}

// Initialize drag and drop
function initDragAndDrop() {
    if (!uploadZoneA || !uploadZoneB) return;

    [uploadZoneA, uploadZoneB].forEach((zone, index) => {
        const isA = index === 0;
        const fileInput = isA ? fileInputA : fileInputB;

        // Click to upload
        zone.addEventListener('click', () => fileInput.click());

        // Drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.remove('drag-over');
            });
        });

        zone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0], isA);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0], isA);
            }
        });
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleFile(file, isA) {
    // Validate file type
    const validExtensions = ['pdf', 'docx', 'txt'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
        showError(`Invalid file type: ${extension}. Please upload PDF, DOCX, or TXT files.`);
        return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showError(`File too large: ${formatFileSize(file.size)}. Maximum size is 10MB.`);
        return;
    }

    // Store file
    if (isA) {
        fileA = file;
        displayFileInfo(file, fileInfoA, uploadZoneA);
    } else {
        fileB = file;
        displayFileInfo(file, fileInfoB, uploadZoneB);
    }

    // Clear error
    hideError();

    // Enable compare button if both files are selected
    updateCompareButton();
}

function displayFileInfo(file, infoElement, zone) {
    const fileName = infoElement.querySelector('.file-name');
    const fileSize = infoElement.querySelector('.file-size');

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    infoElement.style.display = 'block';
    zone.classList.add('has-file');

    // Hide upload instruction
    const instruction = zone.querySelector('.upload-instruction');
    const formats = zone.querySelector('.upload-formats');
    const icon = zone.querySelector('.upload-icon');

    if (instruction) instruction.style.display = 'none';
    if (formats) formats.style.display = 'none';
    if (icon) icon.style.display = 'none';
}

function removeFile(which) {
    if (which === 'A') {
        fileA = null;
        if (fileInfoA) fileInfoA.style.display = 'none';
        if (uploadZoneA) uploadZoneA.classList.remove('has-file');
        if (fileInputA) fileInputA.value = '';

        if (uploadZoneA) {
            const instruction = uploadZoneA.querySelector('.upload-instruction');
            const formats = uploadZoneA.querySelector('.upload-formats');
            const icon = uploadZoneA.querySelector('.upload-icon');

            if (instruction) instruction.style.display = 'block';
            if (formats) formats.style.display = 'block';
            if (icon) icon.style.display = 'block';
        }
    } else {
        fileB = null;
        if (fileInfoB) fileInfoB.style.display = 'none';
        if (uploadZoneB) uploadZoneB.classList.remove('has-file');
        if (fileInputB) fileInputB.value = '';

        if (uploadZoneB) {
            const instruction = uploadZoneB.querySelector('.upload-instruction');
            const formats = uploadZoneB.querySelector('.upload-formats');
            const icon = uploadZoneB.querySelector('.upload-icon');

            if (instruction) instruction.style.display = 'block';
            if (formats) formats.style.display = 'block';
            if (icon) icon.style.display = 'block';
        }
    }

    updateCompareButton();
    hideError();
}

function updateCompareButton() {
    if (isTextMode) {
        updateCompareButtonForText();
    } else {
        compareBtn.disabled = !(fileA && fileB);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Compare documents (files or text)
async function compareDocuments() {
    // Hide error and results
    hideError();
    resultsSection.style.display = 'none';

    // Show loading with progress animation
    loadingState.style.display = 'block';
    loadingState.innerHTML = showProgressAnimation('Uploading and analyzing documents...');
    compareBtn.disabled = true;

    try {
        let response;

        if (isTextMode) {
            // Text comparison mode
            const textA = textInputA.value.trim();
            const textB = textInputB.value.trim();

            if (!textA || !textB) {
                showError('Please enter text in both fields');
                return;
            }

            // Send as JSON for text comparison
            response = await fetch(`${API_BASE_URL}/api/compare-text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    textA: textA,
                    textB: textB
                })
            });
        } else {
            // File comparison mode
            if (!fileA || !fileB) {
                showError('Please select both documents');
                return;
            }

            const formData = new FormData();
            formData.append('documentA', fileA);
            formData.append('documentB', fileB);

            response = await fetch(`${API_BASE_URL}/api/compare`, {
                method: 'POST',
                body: formData
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Comparison failed');
        }

        // Display results
        displayResults(data);

        // Gamification: Award points and track conversions
        if (typeof awardPoints === 'function') {
            awardPoints(10, 'Comparison completed');
        }
        if (typeof incrementConversions === 'function') {
            const userData = incrementConversions();
            // Show achievement badge if new one was earned
            if (userData.hasNewBadges && userData.newBadges.length > 0) {
                const badge = userData.newBadges[userData.newBadges.length - 1];
                setTimeout(() => {
                    alert(`🏆 Achievement Unlocked: ${badge.emoji} ${badge.name} - ${badge.description}`);
                }, 500);
            }
            // Refresh social proof banner with updated stats
            const socialProofContainer = document.getElementById('socialProofContainer');
            if (socialProofContainer && typeof createSocialProof === 'function') {
                socialProofContainer.innerHTML = createSocialProof();
            }
        }

        // Show feedback survey after successful comparison
        setTimeout(() => {
            if (typeof showPostConversionFeedback === 'function') {
                showPostConversionFeedback();
            }
        }, 1500);

    } catch (error) {
        showError(error.message || 'An error occurred while comparing');
        console.error('Comparison error:', error);
    } finally {
        loadingState.style.display = 'none';
        compareBtn.disabled = false;
    }
}

function displayResults(data) {
    // Parse AI response (it should be JSON)
    let comparisonData;
    try {
        // Remove markdown code blocks if present
        let cleanedResponse = data.comparison.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        comparisonData = JSON.parse(cleanedResponse);
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        showError("I'm sorry, this data cannot be extracted. The file content may be unclear or unsupported.");
        return;
    }

    // Check for empty or invalid data structure after parsing
    if (!comparisonData || (!comparisonData.summary && !comparisonData.additions && !comparisonData.deletions && !comparisonData.modifications)) {
        showError("I'm sorry, this data cannot be extracted. No valid text or tables were found.");
        return;
    }

    // Display summary
    const summaryEl = document.getElementById('resultsSummary');
    summaryEl.innerHTML = `
        <h3>📊 Summary</h3>
        <p>${comparisonData.summary || 'Comparison completed successfully'}</p>
    `;

    // Display statistics
    const statsGrid = document.getElementById('statsGrid');
    const stats = comparisonData.statistics || {};
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-value total">${stats.total_changes || 0}</div>
            <div class="stat-card-label">Total Changes</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value added">${stats.additions_count || 0}</div>
            <div class="stat-card-label">Additions</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value removed">${stats.deletions_count || 0}</div>
            <div class="stat-card-label">Deletions</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-value modified">${stats.modifications_count || 0}</div>
            <div class="stat-card-label">Modifications</div>
        </div>
    `;

    // Display additions
    displayChangesList(
        comparisonData.additions || [],
        'additionsList',
        'additionsCount',
        'added',
        'No additions found'
    );

    // Display deletions
    displayChangesList(
        comparisonData.deletions || [],
        'deletionsList',
        'deletionsCount',
        'removed',
        'No deletions found'
    );

    // Display modifications
    displayModificationsList(
        comparisonData.modifications || [],
        'modificationsList',
        'modificationsCount'
    );

    // Show results section
    resultsSection.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Setup Gemini Button
    const geminiBtn = document.getElementById('openGeminiBtn');
    if (geminiBtn) {
        // Clone to remove old listeners
        const newBtn = geminiBtn.cloneNode(true);
        geminiBtn.parentNode.replaceChild(newBtn, geminiBtn);

        newBtn.addEventListener('click', () => {
            // Include the initial comparison result in the prompt
            // Format the initial comparison result as readable text (not JSON)
            const stats = comparisonData.statistics || {};
            let readableSummary = `Initial Findings Summary:\n${comparisonData.summary || 'No summary available.'}\n\nKey Metrics:\n- Total Changes: ${stats.total_changes || 0}\n- Additions: ${stats.additions_count || 0}\n- Deletions: ${stats.deletions_count || 0}\n- Modifications: ${stats.modifications_count || 0}`;

            const prompt = `I have performed an initial comparison of attached documents. Here is the summary of changes found:\n\n${readableSummary}\n\nBased on these findings and the documents below, please perform a DEEPER analysis. Identify subtle differences, potential risks, and semantic implications.\n\nDocument A (Original):\n---\n${data.textA || ''}\n---\n\nDocument B (Modified):\n---\n${data.textB || ''}\n---\n\nProvide a comprehensive expert report.`;

            navigator.clipboard.writeText(prompt).then(() => {
                alert("Copied to clipboard! \n\n1. Gemini will open in a new tab.\n2. Simply PASTE (Ctrl+V) to start the analysis.");
                window.open('https://gemini.google.com/app', '_blank');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert("Failed to copy to clipboard. Please allow clipboard access.");
            });
        });
    }

    // Setup Download Report Button
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
        // Clone to clean
        const newDownloadBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

        newDownloadBtn.addEventListener('click', () => {
            // 1. Generate Report Content
            const stats = comparisonData.statistics || {};
            let reportContent = `COMPARE DOCS AI - REPORT\n=========================\n\n`;
            reportContent += `SUMMARY\n-------\n${comparisonData.summary || 'N/A'}\n\n`;
            reportContent += `STATISTICS\n----------\nTotal Changes: ${stats.total_changes || 0}\nAdditions: ${stats.additions_count || 0}\nDeletions: ${stats.deletions_count || 0}\nModifications: ${stats.modifications_count || 0}\n\n`;

            if (comparisonData.additions && comparisonData.additions.length) {
                reportContent += `ADDITIONS\n---------\n${comparisonData.additions.join('\n- ')}\n\n`;
            }
            if (comparisonData.deletions && comparisonData.deletions.length) {
                reportContent += `DELETIONS\n---------\n${comparisonData.deletions.join('\n- ')}\n\n`;
            }

            // 2. Trigger Download
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'comparison_report.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // 3. Prompt Contact Modal immediately
            if (typeof showContactModal === 'function') {
                showContactModal();
            }
        });
    }
}

function displayChangesList(changes, listId, countId, className, emptyMessage) {
    const listEl = document.getElementById(listId);
    const countEl = document.getElementById(countId);

    countEl.textContent = changes.length;

    if (changes.length === 0) {
        listEl.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    } else {
        listEl.innerHTML = changes.map(change => `
            <div class="change-item ${className}">
                ${typeof change === 'string' ? change : change.text || JSON.stringify(change)}
            </div>
        `).join('');
    }
}

function displayModificationsList(modifications, listId, countId) {
    const listEl = document.getElementById(listId);
    const countEl = document.getElementById(countId);

    countEl.textContent = modifications.length;

    if (modifications.length === 0) {
        listEl.innerHTML = '<div class="empty-state">No modifications found</div>';
    } else {
        listEl.innerHTML = modifications.map(mod => `
            <div class="change-item modified">
                <div class="modification-item">
                    ${mod.description ? `<p><strong>${mod.description}</strong></p>` : ''}
                    ${mod.original ? `
                        <div>
                            <div class="mod-label">Original (Text A):</div>
                            <div class="mod-text">${escapeHtml(mod.original)}</div>
                        </div>
                    ` : ''}
                    ${mod.changed ? `
                        <div>
                            <div class="mod-label">Changed (Text B):</div>
                            <div class="mod-text">${escapeHtml(mod.changed)}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function resetComparison() {
    // Reset files
    removeFile('A');
    removeFile('B');

    // Reset text inputs
    if (textInputA) textInputA.value = '';
    if (textInputB) textInputB.value = '';
    if (charCountA) charCountA.textContent = '0';
    if (charCountB) charCountB.textContent = '0';

    // Hide results
    resultsSection.style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();

    // Initialize social proof banner (index.html only)
    const socialProofContainer = document.getElementById('socialProofContainer');
    if (socialProofContainer && typeof createSocialProof === 'function') {
        socialProofContainer.innerHTML = createSocialProof();
    }

    // Initialize in-app tips (index.html only)
    const inAppTipsContainer = document.getElementById('inAppTipsContainer');
    if (inAppTipsContainer && typeof showInAppTip === 'function') {
        showInAppTip(inAppTipsContainer);
    }

    // Toggle mode
    if (inputModeToggle) {
        inputModeToggle.addEventListener('change', toggleInputMode);
    }

    // Text input character counters
    if (textInputA) {
        textInputA.addEventListener('input', () => {
            updateCharCount('textInputA', 'charCountA');
            updateCompareButtonForText();
        });
    }

    if (textInputB) {
        textInputB.addEventListener('input', () => {
            updateCharCount('textInputB', 'charCountB');
            updateCompareButtonForText();
        });
    }

    // Compare button
    if (compareBtn) {
        compareBtn.addEventListener('click', compareDocuments);
    }

    // New comparison button
    if (newCompareBtn) {
        newCompareBtn.addEventListener('click', resetComparison);
    }

    // Clear Inputs Button
    const clearBtn = document.getElementById('clearInputsBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            resetComparison();
        });
    }
});

// Make removeFile available globally
window.removeFile = removeFile;
