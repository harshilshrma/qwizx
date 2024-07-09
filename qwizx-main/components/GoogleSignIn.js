"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const GoogleSignIn = ({ onSignIn }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleSignInWithGoogle,
                    ux_mode: 'popup',
                    auto_select: true,
                    context: 'signin',
                    itp_support: true,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('google-signin-button'),
                    {
                        type: 'standard',
                        shape: 'rectangular',
                        theme: 'outline',
                        text: 'signin_with',
                        size: 'large',
                        logo_alignment: 'left',
                    }
                );
            }
        };
        document.head.appendChild(script);

        window.handleSignInWithGoogle = async (response) => {
            console.log('Google sign-in response:', response);

            if (response.credential) {
                const { data, session, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: response.credential,
                });

                if (error) {
                    console.error('Sign in error:', error);
                } else {
                    console.log('Sign in data:', data);
                    const user = {
                        name: data.user.user_metadata.full_name,
                        profileImage: data.user.user_metadata.avatar_url,
                    };
                    setUserData(user);
                    onSignIn(user);
                }
            } else {
                console.error('No credential received from Google sign-in');
            }
        };
    }, []);

    return (
        <div>
            {userData ? (
                <button type="button" className="btn btn-outline-primary" onClick={() => console.log("Clicked")} style={{ display: "flex", alignItems: "center" }}>
                    {/* <img src={userData.profileImage} alt="Profile" style={{ width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px" }} /> */}
                    <p className='text-primary text-lg'> Hi,&nbsp;{userData.name}</p>
                </button>
            ) : (
                <div>
                    <div
                        id="g_id_onload"
                        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                        data-context="signin"
                        data-ux_mode="popup"
                        data-callback="handleSignInWithGoogle"
                        data-auto_select="true"
                        data-itp_support="true"
                    ></div>
                    <div id="google-signin-button"></div>
                </div>
            )}
        </div>
    );
};

export default GoogleSignIn;
