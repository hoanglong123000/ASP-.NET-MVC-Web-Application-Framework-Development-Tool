
    /*var myViewModel = {
    personName: 'Bob',
    personAge: 123
};
ko.applyBindings(myViewModel);
*/
/*var SoldCouponClass = () => {


    // this Initialization.
    self = this;


    // List.
    self.ReceiptArray = ko.observableArray();

    // Summation of each final price rows.
    self.totalprice = ko.observable();


    // New Row.
    var ReceiptRow = function () {
        var sr = this;
        {
            sr.id = self.ReceiptArray().length + 1;
            sr.couponname = ko.observable("");
            sr.unitmeasure = ko.observable("VND");
            sr.ammount = ko.observable(0);
            sr.price = ko.observable(1);
            sr.finalprice = ko.observable();

        }
    };




    // Add Method.
    self.AddReceiptRow = () => {
        var item = new ReceiptRow(null);
        self.ReceiptArray.push(item);
        console.log(item);
    };

    //Calculating total price and final price.
    self.realtime = ko.computed(
        () => {
            var Sum = 0;
            $(self.ReceiptArray()).each(function (index, element) {

                element.finalprice = parseInt(element.ammount() * element.price());

                
                Sum += parseInt(element.finalprice());
                self.totalprice(Sum);

                console.log(element.finalprice);

            })


        }
    )

    // Delete method.
    self.DeleteReceiptRow = (item) => {
        console.log(item);
        self.ReceiptArray.remove(item);
    };

    // Show Sum.
    self.ShowTotalPrice = () => {
        console.log(self.totalprice());
        console.log(ko.toJS(self.ReceiptArray));
    }

    // Update method

}

ko.applyBindings(SoldCouponClass, $("#SoldCouponForm")[0]);
*/