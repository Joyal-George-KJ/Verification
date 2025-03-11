import { Account, Client } from "appwrite";
import React, { useEffect, useState } from "react";

const Verify = () => {
    const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'
    const [redirect, setRedirect] = useState(""); // 'loading', 'success', 'error'
    const [message, setMessage] = useState("Verifying your account...");

    useEffect(() => {
        const Queries = new URLSearchParams(window.location.search);
        const userID = Queries.get("userId");
        const secret = Queries.get("secret");
        const projectID = Queries.get("projectId");
        const URL = Queries.get("Redirect");

        if (!userID || !secret || !projectID || !URL) {
            setStatus("error");
            setMessage("🚫Invalid or missing verification link parameters.");
            return;
        }

        console.log(userID, secret, projectID, URL);
        

        const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject(projectID);
        const account = new Account(client);

        account.updateVerification(userID, secret)
            .then(() => {
                setStatus("success");
                setRedirect(URL);
                setMessage("✅ Your account has been successfully verified!");
            })
            .catch((error) => {
                console.error("Verification failed:", error);
                setStatus("error");
                setMessage("❌ Verification failed. Please try again or contact support.");
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Account Verification</h2>

            {status === "loading" && (
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin my-4"></div>
            )}

            <p className={`text-lg font-medium ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
            </p>

            {status === "success" && (
                <a
                    href={redirect}
                    className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
                >
                    Go to Login
                </a>
            )}
        </div>
    );
};

export default Verify;
