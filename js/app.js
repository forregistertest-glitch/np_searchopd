// Global variables
let allData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 50;
let currentVersion = 'v3'; // Default version

// Function to get CSV files based on version
function getCsvFiles(version) {
    const years = ['66', '67', '68', '69'];
    const periods = ['ในเวลาราชการ', 'นอกเวลาราชการ', 'วันหยุดราชการ'];
    const files = [];
    
    for (const year of years) {
        for (const period of periods) {
            files.push(`${year}_${period}_final_date_${version}.csv`);
        }
    }
    
    return files;
}

// CSV files to load (default v3)
let csvFiles = getCsvFiles('v3');

// DOM elements
const loading = document.getElementById('loading');
const loadingDetail = document.getElementById('loadingDetail');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const versionFilter = document.getElementById('versionFilter');
const yearFilter = document.getElementById('yearFilter');
const periodFilter = document.getElementById('periodFilter');
const provinceFilter = document.getElementById('provinceFilter');
const resetFilters = document.getElementById('resetFilters');
const resultsBody = document.getElementById('resultsBody');
const resultCount = document.getElementById('resultCount');
const searchTime = document.getElementById('searchTime');
const totalRecords = document.getElementById('totalRecords');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// Load all CSV files
async function loadAllData() {
    try {
        let loadedCount = 0;
        
        for (const file of csvFiles) {
            loadingDetail.textContent = `กำลังโหลด ${file}... (${loadedCount + 1}/${csvFiles.length})`;
            
            const response = await fetch(`data/${file}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            
            const csvText = await response.text();
            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                encoding: 'UTF-8'
            });
            
            // Add metadata to each row
            const year = file.substring(0, 2);
            const period = file.includes('ในเวลาราชการ') ? 'ในเวลาราชการ' 
                         : file.includes('นอกเวลาราชการ') ? 'นอกเวลาราชการ' 
                         : 'วันหยุดราชการ';
            
            parsed.data.forEach(row => {
                row._year = year;
                row._period = period;
                row._source = file;
            });
            
            allData.push(...parsed.data);
            loadedCount++;
        }
        
        // Initialize filters
        initializeFilters();
        
        // Show search container
        loading.style.display = 'none';
        searchContainer.style.display = 'block';
        
        // Update total records
        totalRecords.textContent = allData.length.toLocaleString();
        
        // Show all data initially
        filteredData = allData;
        displayResults();
        
        console.log(`Loaded ${allData.length} records from ${csvFiles.length} files`);
    } catch (error) {
        console.error('Error loading data:', error);
        loadingDetail.textContent = `เกิดข้อผิดพลาด: ${error.message}`;
        loadingDetail.style.color = 'red';
    }
}

// Initialize filter options
function initializeFilters() {
    // Get unique provinces
    const provinces = new Set();
    allData.forEach(row => {
        if (row['จังหวัด']) {
            provinces.add(row['จังหวัด']);
        }
    });
    
    // Sort provinces
    const sortedProvinces = Array.from(provinces).sort();
    
    // Add to province filter
    sortedProvinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceFilter.appendChild(option);
    });
}

// Normalize whitespace (แปลง space หลายตัวเป็น 1 ตัว)
function normalizeWhitespace(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// Search function
function search() {
    const startTime = performance.now();
    
    const query = normalizeWhitespace(searchInput.value.toLowerCase());
    const selectedYear = yearFilter.value;
    const selectedPeriod = periodFilter.value;
    const selectedProvince = provinceFilter.value;
    
    // Filter data
    filteredData = allData.filter(row => {
        // Text search
        let matchesSearch = true;
        if (query) {
            const name = normalizeWhitespace((row['ชื่อสกุล'] || '').toLowerCase());
            const opdBefore = (row['OPD_ก่อนแก้'] || '').toLowerCase();
            const opdAfter = (row['OPD_หลังแก้'] || '').toLowerCase();
            
            matchesSearch = name.includes(query) 
                         || opdBefore.includes(query)
                         || opdAfter.includes(query);
        }
        
        // Year filter
        const matchesYear = !selectedYear || row._year === selectedYear;
        
        // Period filter
        const matchesPeriod = !selectedPeriod || row._period === selectedPeriod;
        
        // Province filter
        const matchesProvince = !selectedProvince || row['จังหวัด'] === selectedProvince;
        
        return matchesSearch && matchesYear && matchesPeriod && matchesProvince;
    });
    
    const endTime = performance.now();
    const searchDuration = (endTime - startTime).toFixed(2);
    
    // Update search time
    searchTime.textContent = `เวลาค้นหา: ${searchDuration} ms`;
    
    // Reset to first page
    currentPage = 1;
    
    // Display results
    displayResults();
}

// Display results
function displayResults() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);
    
    // Clear table
    resultsBody.innerHTML = '';
    
    if (pageData.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="12" class="no-results">ไม่พบข้อมูล</td></tr>';
        resultCount.textContent = 'แสดง 0 จาก 0 รายการ';
    } else {
        const query = normalizeWhitespace(searchInput.value.toLowerCase());
        
        pageData.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            const rowNumber = start + index + 1;
            const name = row['ชื่อสกุล'] || '';
            const opdBefore = row['OPD_ก่อนแก้'] || '';
            const opdAfter = row['OPD_หลังแก้'] || '';
            
            // Highlight matching text
            const highlightedName = highlightText(name, query);
            const highlightedOpdBefore = highlightText(opdBefore, query);
            const highlightedOpdAfter = highlightText(opdAfter, query);
            
            tr.innerHTML = `
                <td>${rowNumber}</td>
                <td>${row['วันที่'] || ''}</td>
                <td>${highlightedOpdBefore}</td>
                <td>${highlightedOpdAfter}</td>
                <td>${highlightedName}</td>
                <td>${row['อำเภอ'] || ''}</td>
                <td>${row['จังหวัด'] || ''}</td>
                <td>${row['สุนัข'] || ''}</td>
                <td>${row['แมว'] || ''}</td>
                <td>${row['สัตว์เลี้ยงลูกด้วยนม'] || ''}</td>
                <td>25${row._year}</td>
                <td>${row._period}</td>
            `;
            
            resultsBody.appendChild(tr);
        });
        
        // Update result count
        const showing = Math.min(end, filteredData.length);
        resultCount.textContent = `แสดง ${start + 1}-${showing} จาก ${filteredData.length.toLocaleString()} รายการ`;
    }
    
    // Update pagination
    updatePagination();
}

// Highlight matching text
function highlightText(text, query) {
    if (!query || !text) return text;
    
    const normalizedText = normalizeWhitespace(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return normalizedText.replace(regex, '<span class="highlight">$1</span>');
}

// Escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    clearBtn.style.display = e.target.value ? 'block' : 'none';
    search();
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    search();
});

versionFilter.addEventListener('change', async () => {
    const newVersion = versionFilter.value;
    if (newVersion !== currentVersion) {
        currentVersion = newVersion;
        csvFiles = getCsvFiles(newVersion);
        
        // แสดง loading
        searchContainer.style.display = 'none';
        loading.style.display = 'flex';
        
        // โหลดข้อมูลใหม่
        await loadAllData();
    }
});

yearFilter.addEventListener('change', search);
periodFilter.addEventListener('change', search);
provinceFilter.addEventListener('change', search);

resetFilters.addEventListener('click', () => {
    searchInput.value = '';
    yearFilter.value = '';
    periodFilter.value = '';
    provinceFilter.value = '';
    clearBtn.style.display = 'none';
    search();
});

prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextPage.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayResults();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Load data on page load
window.addEventListener('DOMContentLoaded', loadAllData);
