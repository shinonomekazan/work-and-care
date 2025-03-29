import { loadGapiInsideDOM } from "gapi-script";

export class googleLogin {
	readonly clientId = "698880356475-ufs8gocqbjfjn1ks1cb3bm7o76garmpe.apps.googleusercontent.com.apps.googleusercontent.com";
	async initAuth() {
		const gapi = await loadGapiInsideDOM();
		gapi.load("auth2", async () => {
			await gapi.auth2.init({
				client_id: this.clientId,
				scope: "https://www.googleapis.com/auth/drive.readonly",
			});
			const authInstance = gapi.auth2.getAuthInstance();
			const user = await authInstance.signIn();
			const accessToken = user.getAuthResponse().access_token;
			console.log("Access Token:", accessToken);
			//fetchGoogleDriveFile("YOUR_FILE_ID", accessToken);
		});
	}
	async fetchGoogleDriveFile(fileId: string, accessToken: string) {
		const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

		try {
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			if (!response.ok) throw new Error("Failed to fetch image");

			const blob = await response.blob();
			const imgURL = URL.createObjectURL(blob);

			// Hiển thị ảnh lên màn hình
			const img = document.createElement("img");
			img.src = imgURL;
			document.body.appendChild(img);

		} catch (error) {
			console.error("Error fetching file:", error);
		}
	}
}