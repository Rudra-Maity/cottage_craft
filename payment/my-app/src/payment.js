// import { useNavigate } from 'react-router-dom'; 

function RazPayment(data, pid) {
    // const navigate = useNavigate();
    var options = {
        "key": process.env.api,
        "amount": "" + data.amount_due,
        "currency": "INR",
        "name": "Cottage_craft",
        "order_id": data.id,
        "handler": function (response) {
            alert("This step of Payment Succeeded");
            console.log('first : ', response)
            const paymentInfo = {
                response,
                pid: pid,
                rcp_id: data.receipt
            }
            console.log("second", paymentInfo);
            fetch('http://localhost:2000/user/payment/pay/result/' + pid + '/' + data.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentInfo),
            })
                .then((paydata) => {
                    if (!paydata.ok) {
                        console.log('Server Error');
                    }
                    return paydata.json();
                })
                .then((responseData) => {
                    console.log(responseData);
                    //    window. location.replace('/user/order/result?success=true')
                    window.location.assign('/user/order/result?success=true')
                    // myHistory('/user/order/result?success=true')
                })


        },
        "prefill": {
            "email": data.email
        },
        "notes": {
            "purpose": data.notes.purpose,
            "description": "Best Product",
            "access": "onyly one year warenty"
        },
        "theme": {
            "color": "#3300a3"
        }
    };
    // Call the external function after the component mounts
    try {
        const razorpayObject = new window.Razorpay(options);
        console.log(razorpayObject);
        razorpayObject.on('payment.failed', function (response) {
            console.log('second', response);
            alert("This step of Payment Failed");
        });

        razorpayObject.open();
    } catch (err) {
        window.location.replace('*')
    }
}

export default RazPayment