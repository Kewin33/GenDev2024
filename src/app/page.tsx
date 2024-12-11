/* eslint-disable */
import Link from 'next/link';
import {useRouter} from 'next/router';

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Streaming Services Comparison</h1>
            <p className="mb-4">
                Welcome to the Streaming Services Comparison tool! Here, you can compare various streaming platforms based on their pricing, available content, and user ratings.
            </p>
            <Link href="/components" className="text-blue-500 hover:underline">
                Go to Detailed Comparison
            </Link>
        </div>
    );
}