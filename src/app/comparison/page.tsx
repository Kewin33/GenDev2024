import Table from "../components/table";

export default function Compare() {
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Streaming Services Comparison</h1>
                <p className="mb-4">
                    Welcome to the Streaming Services Comparison tool! Here, you can compare various streaming platforms
                    based on their pricing, available content, and user ratings.
                </p>
            </div>
            <Table></Table>
        </>

    );
}