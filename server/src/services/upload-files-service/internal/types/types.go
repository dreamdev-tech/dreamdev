package types

type FileToUpload struct {
	FileName string `json:"file_name"`
	FileURL  string `json:"file_url"`
	FIle     []byte `json:"file"`
}
