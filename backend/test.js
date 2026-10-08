import mongoose from "mongoose";

const URI =
    "mongodb+srv://Sohit:TaskFlow12345@taskflow.viyb1z7.mongodb.net/taskflow?retryWrites=true&w=majority&appName=TaskFlow";

async function test() {
    try {
        console.log("Connecting...");

        const conn = await mongoose.connect(URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("✅ SUCCESS");
        console.log("Host:", conn.connection.host);
        console.log("Database:", conn.connection.name);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ FAILED");
        console.error(err.message);
        process.exit(1);
    }
}

test();