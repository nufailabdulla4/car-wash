// Base package pricing mapping
const PACKAGE_PRICES = {
    basic: { name: 'Basic Wash', price: 25 },
    express: { name: 'Express Shine', price: 45 },
    premium: { name: 'Premium Detail', price: 75 },
    ultimate: { name: 'Ultimate Polish', price: 120 }
};

// Vehicle size extra costs
const VEHICLE_PRICES = {
    sedan: 0,
    suv: 10,
    truck: 20
};

// Time Slots list
const TIME_SLOTS = [
    "09:00 AM", "10:30 AM", "12:00 PM", 
    "01:30 PM", "03:00 PM", "04:30 PM"
];

// Initialize Defaults on Load
document.addEventListener('DOMContentLoaded', () => {
    // Restrict datepicker past dates
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bookingDate');
    dateInput.min = today;
    dateInput.value = today;

    // Render initial time slots
    renderTimeSlots();
    
    // Initial Price Calculation
    calculateTotal();
});

// Render dynamic time slot buttons
function renderTimeSlots() {
    const grid = document.getElementById('timeSlotGrid');
    grid.innerHTML = '';

    TIME_SLOTS.forEach((slot, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `slot-btn py-2 px-1 text-xs font-bold rounded-lg border border-gray-800 bg-gray-950 text-gray-400 hover:border-blue-500 hover:text-white transition-all`;
        btn.innerText = slot;
        
        // Auto select first slot
        if (index === 0) {
            btn.classList.add('border-blue-500', 'bg-blue-500/20', 'text-blue-400');
            document.getElementById('selectedTime').value = slot;
        }

        btn.onclick = () => {
            document.querySelectorAll('.slot-btn').forEach(b => {
                b.classList.remove('border-blue-500', 'bg-blue-500/20', 'text-blue-400');
            });
            btn.classList.add('border-blue-500', 'bg-blue-500/20', 'text-blue-400');
            document.getElementById('selectedTime').value = slot;
            updateSummary();
        };

        grid.appendChild(btn);
    });
}

// Package Selection from Service Cards
function selectPackage(pkgKey) {
    const radio = document.getElementById(`pkg-${pkgKey}`);
    if (radio) {
        radio.checked = true;
        calculateTotal();
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    }
}

// Real-time Order Summary & Calculation Engine
function calculateTotal() {
    // 1. Get Selected Package Price
    const selectedPkg = document.querySelector('input[name="package"]:checked').value;
    const pkgData = PACKAGE_PRICES[selectedPkg];
    
    // 2. Get Vehicle Type Price
    const selectedVehicle = document.querySelector('input[name="vehicleType"]:checked').value;
    const vehicleFee = VEHICLE_PRICES[selectedVehicle];

    // 3. Get Selected Addons
    const addons = document.querySelectorAll('.addon-checkbox:checked');
    let addonsTotal = 0;
    const addonsListContainer = document.getElementById('summaryAddonsList');
    addonsListContainer.innerHTML = '';

    if (addons.length > 0) {
        addons.forEach(addon => {
            const val = parseFloat(addon.value);
            const name = addon.dataset.name;
            addonsTotal += val;

            const div = document.createElement('div');
            div.className = 'flex justify-between text-gray-400';
            div.innerHTML = `<span>+ ${name}</span><span class="text-white font-semibold">+$${val.toFixed(2)}</span>`;
            addonsListContainer.appendChild(div);
        });
    }

    // 4. Update Price Displays
    const total = pkgData.price + vehicleFee + addonsTotal;

    document.getElementById('summaryPkgName').innerText = pkgData.name;
    document.getElementById('summaryPkgPrice').innerText = `$${pkgData.price.toFixed(2)}`;
    document.getElementById('summarySizeFee').innerText = `+$${vehicleFee.toFixed(2)}`;
    document.getElementById('summaryTotal').innerText = `$${total.toFixed(2)}`;

    updateSummary();
}

// Update date and time in summary sidebar
function updateSummary() {
    const dateVal = document.getElementById('bookingDate').value;
    const timeVal = document.getElementById('selectedTime').value;

    document.getElementById('summaryDate').innerText = dateVal || 'Not selected';
    document.getElementById('summaryTime').innerText = timeVal || 'Not selected';
}

// Handle Form Submission
function handleBooking(event) {
    event.preventDefault();

    const name = document.getElementById('custName').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('selectedTime').value;
    const total = document.getElementById('summaryTotal').innerText;

    // Generate Random Booking ID
    const bookingId = '#ASH-' + Math.floor(1000 + Math.random() * 9000);

    // Populate Modal Details
    document.getElementById('modalBookingId').innerText = bookingId;
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalSlot').innerText = `${date} at ${time}`;
    document.getElementById('modalAmount').innerText = total;

    // Open Modal
    document.getElementById('confirmationModal').classList.remove('hidden');
}

// Close Modal
function closeModal() {
    document.getElementById('confirmationModal').classList.add('hidden');
}
