import React , {useState , useEffect} from "react";
import { Link , useHistory } from "react-router-dom";
import _ from "lodash";
import $ from 'jquery';
import {addUser} from '../services/addClient';
import {getUsAllClients} from '../services/getClinet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const SignUpPage = () => {

    const [FirstName,setFirstName] = useState("");
    const [LastName,setLastName] = useState("");
    const [UserName,setUserName] = useState("");
    const [Password,setPassword] = useState("");
    const [MobileNumber,setMobileNumber] = useState("");
    const [Email,setEmail] = useState("");
    const [AgreeRules,setAgreeRules] = useState(false);
    const [UserCreated,setUserCreated] = useState(false);
    const [ClientSelected , setClientSelected] = useState(-1);

    const history = useHistory();

    const  handleSginUp = async () =>{
        console.log(ClientSelected);
        if(
            _.isEmpty(FirstName) ||
            _.isEmpty(LastName) || 
            _.isEmpty(UserName) ||
            _.isEmpty(Password) ||
            _.isEmpty(MobileNumber) ||
            _.isEmpty(Email) ||
            ClientSelected == -1 ||
            !AgreeRules 
        ){
            toast.error("please complete all inputs!!")
        }else{
            let dataUser = JSON.stringify({
                userName : UserName,
                fullName : FirstName + " " + LastName,
                email : Email,
                password : Password,
                phone : MobileNumber,
                Client : ClientSelected
            });
            const {status,data} = await addUser(dataUser);

            // console.log(data);
            setUserCreated(true);
            // history.push('/verification');
        }
    }

    const getAllClientsAndShow = async () => {
        const {data , status} = await getUsAllClients();
        var table = '';
        var record = data.data;
        $.each(record, (i, row) => {
            table += `<option value='${row._id}' > ${row.fullName} </option>`;
        });

        $("#clientShow").html(table);
        setClientSelected(record[0]._id);
    }

    const handleShowPass = () =>{
        if($(".signUpPass").attr("type") == "password" ) {

            $(".signUpPass").attr("type","text")
        }else{
            $(".signUpPass").attr("type","password")
        }
    }

    useEffect(() =>{
        getAllClientsAndShow();
    },[])

    return (
        <>
            {UserCreated ? 
            
                <section className="auth-wrapper confirm-wrapper">
                    <div className="auth-box">
                        <img src="assets/images/confirm.png" alt="" />
                        <h2 className="title">Account Created Successfully</h2>
                        <Link to="/login">
                            <button>Sign In</button>
                        </Link>
                    </div>
                </section>

            :

                <section class="auth-wrapper signup-wrapper">
                    {/* <!-- <form class="auth-box"> --> */}
                    <div class="auth-box">
                        <h2 class="title">Sign Up</h2>
                        <p class="tagline">
                            {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor. */}
                        </p>
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            type="text"
                                            placeholder="First Name*"
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            type="text"
                                            placeholder="Last Name*"
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            type="text"
                                            placeholder="Username*"
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            className="signUpPass"
                                            type="password"
                                            placeholder="Create Password*"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <FontAwesomeIcon icon={faEye} onClick={handleShowPass}/>
                                        {/* <i class="fas fa-eye"></i> */}
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            type="number"
                                            placeholder="Mobile Number*"
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="input-box">
                                        <input
                                            type="email"
                                            placeholder="Email Address*"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6 mx-auto mt-4">
                                    <div class="input-box">
                                        <select className="form-control" id="clientShow" onChange={(e) => setClientSelected(e.target.value)}>
                                            
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="agree-terms">
                                        <label>
                                            By clicking this I agree to
                                            <a href="#" class="text-primary">
                                                Terms
                                            </a>{" "}
                                            and
                                            <a href="#" class="text-primary">
                                                Privacy Policy
                                            </a>
                                            <input type="checkbox" onClick={(e) => {setAgreeRules(e.target.checked)}} />
                                            <span class="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <a href="mobile-verification.html"> */}
                            <button onClick={handleSginUp}>Sign Up</button>
                        {/* </a> */}
                        <div class="box-footer">
                            Already have an account?
                            <Link to="/login" class="text-primary">
                                Log in
                            </Link>
                        </div>
                    </div>
                    {/* <!-- </form> --> */}
                </section>
            
            }

            
        </>
    );
};

export default SignUpPage;
