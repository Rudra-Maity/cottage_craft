import React from 'react';
import RazPayment from './payment.js';


// import  { useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// const radioGroupRef = useRef(null);
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    // console.log(pid);
    this.state = {
      value: 'online_payment', // Default value
    };
    this.radioGroupRef = React.createRef();
  }
  handlePayment = () => {
    // const queryParameters = new URLSearchParams(window.location)

    // alert(window.location.search,"vdmf,d",window.location.href)
    // const pid =queryParameters.get("pid")
    const path = window.location.pathname; // Get the URL path
    const pidMatch = path.match(/\/user\/payment\/([^/]+)/);
    console.log(pidMatch);
    const pid=pidMatch[1]
    const { value} = this.state;
    // alert(pid)
    if (value === "online_payment") {

      //  let param=new useParams() 
      alert('http://localhost:2000/payment/pay/' + pid)
      fetch('http://localhost:2000/user/payment/pay/' + pid + '/' + value) // Replace with your API endpoint
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          RazPayment(data, pid)
        })
        .catch(error => {

          console.error('Fetch error:', error);
        });
    }
    else if (value === "COD") {
      alert('http://localhost:2000/user/payment/pay/' + pid + '/' + value)
      fetch('http://localhost:2000/user/payment/pay/' + pid+'/' + value)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          window.location.replace(data.url)
        })
    }
  }


  handleRadioClick = (event) => {
    if (event.target.type === 'radio') {
      const selectedValue = event.target.value;
      //Update the selected value in state
      this.setState({ value: selectedValue });
      console.log(`Clicked on ${selectedValue}`);
    }
  };


  render() {
    return (
      <div>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
          integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
          crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js"
          integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V"
          crossorigin="anonymous"></script>
        <div className="container d-flex justify-content-center align-items-center " style={{minHeight: '100vh'}}>
          <div className="card shadow-lg p-3 mb-5 bg-body rounded d-flex justify-content-center align-items-center " style={{ width: '28rem',height:'20rem' }}> 
            <div className="card-body mt-6">
              <h5 className="card-title">Payment and order</h5>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" id="flexRadioDefault1" checked={this.state.value === 'online_payment'} value="online_payment" onClick={this.handleRadioClick} />
                <label className="form-check-label" htmlFor="online_payment">
                  online_payment
                </label>
              </div>
              <div className="form-check" >
                <input className="form-check-input" type="radio" name="payment" id="flexRadioDefault2" checked={this.state.value === 'COD'} value="COD" onClick={this.handleRadioClick} />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  COD
                </label>
              </div>
              <button className='btn btn-success mt-4 mx-auto p-6' onClick={this.handlePayment}>Payment and Order</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default MyComponent;
