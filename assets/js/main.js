class QuoteCalculator {
    constructor() {
        this.item = [];
    }

    register(price, quantity) {
        this.item.push({
            price: price,
            quantity: quantity
        });
    }

    calculate_line(price, quantity) {
        let i_price    = $("[name=\"" + price + "\"]");
        let i_quantity = $("[name=\"" + quantity + "\"]");

        // get the value from the inputs
        let v_price    = parseFloat(i_price.val())    || 0;
        let v_quantity = parseFloat(i_quantity.val()) || 0;

        // determine if quantity is a checkbox
        if (i_quantity.is(":checked")) {
            v_quantity = 1;
        }

        return v_price * v_quantity;
    }

    calculate(selector) {
        let total = 0.00;

        this.item.forEach((i, n) => {
            total += this.calculate_line(i.price, i.quantity);
        });

        $(selector).val(total.toFixed(2));
    }

    calculate_gst(selector)
    {
        let total = 0.00;

        this.item.forEach((i, n) => {
            total += this.calculate_line(i.price, i.quantity);
        });

        total += total * 0.1;

        $(selector).val(total.toFixed(2));
    }
}

// ------------------------------------------------------------
// New Instance of QuoteCalculator
// ------------------------------------------------------------

let qc = new QuoteCalculator();

// ------------------------------------------------------------
// Register Form Inputs
// ------------------------------------------------------------

qc.register('ig-price', 'ig-quantity'); // In Ground
qc.register('ic-price', 'ic-quantity'); // In Concrete
qc.register('ag-price', 'ag-quantity'); // Above Ground
qc.register('lb-price', 'lb-quantity'); // Labour
qc.register('sf-price', 'sf-toggle');   // Site Fee
qc.register('dh-price', 'dh-toggle');   // Drill Hire
qc.register('tp-price', 'tp-toggle');   // Timber Pest Inspection
qc.register('sm-price', 'sm-quantity'); // Station Monitor Visit

// ------------------------------------------------------------
// Auto-Calculate Form Inputs
// ------------------------------------------------------------

function calculateDrill() {
    let ic_qty = parseFloat($('[name="ic-quantity"]').val());

    let drill_per_hole   = 25.00;
    let drill_hire_min   = 140.00;

    if (ic_qty > 0) {
        if (ic_qty * drill_per_hole < drill_hire_min) {
            $('[name="dh-price"]').val(drill_hire_min);
        } else {
            $('[name="dh-price"]').val(ic_qty * drill_per_hole);
        }
    } else {
        $('[name="dh-price"]').val(0);
    }
}

function calculateLabour() {
    let ig_qty = parseFloat($('[name="ig-quantity"]').val()) || 0;
    let ic_qty = parseFloat($('[name="ic-quantity"]').val()) || 0;
    let ag_qty = parseFloat($('[name="ag-quantity"]').val()) || 0;

    let duration = 120; // allow 60 minutes for initial setup, 60 minutes for paperwork

    duration += ig_qty * 15;
    duration += ic_qty * 30;
    duration += ag_qty * 30;

    let hours = Math.ceil(duration / 60);

    $('[name="lb-quantity"]').val(hours);
}
// ------------------------------------------------------------
// Auto-Calculate Form Inputs
// ------------------------------------------------------------

$(document).ready(function() {
    $("#accordion").accordion({
        active: 2,
        collapsible: true,
        header: "hr",
        heightStyle: "content"
    });

    $(".title").children("small").fadeOut(0);

    $("textarea[readonly]").each(function() {
        $(this)[0].default_text = $(this).html();
        $(this).height($(this)[0].scrollHeight - 15);
    });

    $("textarea[readonly]").click(function() {
        $(this).prev(".title").children("small").fadeIn(0, function() {
            $(this).fadeOut(1500);
        });

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(this).html()).select();
        document.execCommand("copy");
        $temp.remove();
    });

    $(this).trigger('change');

    $("hr").click(function () {
        let counter = parseInt($(this).css('--rotation').slice(0, -3)) + 180;
        $(this).css('--rotation', counter + "deg");
    });
});

$(document).on('change keyup', function() {
    const values = {};
    values["ig"] = parseInt($('#ig-quantity').val()) || 0;
    values["ic"] = parseInt($('#ic-quantity').val()) || 0;
    values["ag"] = parseInt($('#ag-quantity').val()) || 0;
    values["tl"] = values.ig + values.ic;

    $("textarea[readonly]").each(function(i, element){
        let text = element.default_text;

        text = text.replace(/\{\{([^}]+)\}\}/g, function(all, key) {
            return (values[key] !== undefined) ? values[key] : all;
        });

        $(this).html(text);
    });

    calculateDrill();
    calculateLabour();

    qc.calculate('[name="total"]');
    qc.calculate_gst('[name="total-gst"]');
});
