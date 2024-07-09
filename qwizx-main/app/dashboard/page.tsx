"use client";

export default function Dashboard() {
    return (

        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-left text-primary">Welcome to Your Dashboard!</h1>
            <p className="text-lg text-left">
                QwizX helps you create your own quizzes or take those created by others.
            </p>
            <p className="text-lg text-left mb-4">
                Use the left side panel to navigate:
            </p>
            <p className="text-lg text-left mb-4">
                <span className="text-lg text-left text-primary"><strong>Take a Quiz:</strong></span> Browse and take quizzes created by other users and get instant feedback.
            </p>
            <p className="text-lg text-left mb-4">
                <span className="text-lg text-left text-primary"><strong>Create a Quiz:</strong></span> Design your own quizzes and challenge your friends.
            </p>
        </div>
    );
}
