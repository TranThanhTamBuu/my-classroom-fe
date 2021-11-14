import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import ClassesService from "services/classes.service";

export default function LoggedAcceptLink() {

    const [emailValidForLink, setEmailValidForLink] = useState(false);


    const history = useHistory();
    const user = useSelector((state) => state.user);
    const token = useParams();
    console.log("LoggedAcceptLink", user, token, emailValidForLink);
    useEffect(() => {
        if (!user) {
            history.push("/");
        }
    }, [user]);

    useEffect(() => {
        async function checkEmailValid() {
            console.log("checkEmailValid :" + token.token);
            let data = await ClassesService.checkJoinLinkValid(token.token);
            console.log("data ve : ",data);
            setEmailValidForLink(data.success && data.isAccepted);
        }
        checkEmailValid();
    }, []);

    const onClickJoinClass = async function () {
        console.log("onclick join class");
        let data = await ClassesService.joinClass({ linkId: token.token });
        console.log("data ve: ", data);
        if (data.success) {
            const classId = data.classId.toString();
            history.push("/class/" + classId);
        }
    }

    if (!user) return;

    if (emailValidForLink) {
        return (
            <>
                <div>
                    <h1>CLICK ACCEPT BUTTON TO JOIN THE CLASS</h1>
                </div>
                <div>
                    <button onClick={() => { onClickJoinClass() }}>
                        ACCEPT
                    </button>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div>
                    <h1>YOUR EMAIL IS NOT INVITED TO JOIN THIS CLASS</h1>
                </div>
            </>
        );
    }
}