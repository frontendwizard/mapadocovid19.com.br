import { useEffect } from "react"
/**
 * A hook that allows esc to navegate back.
 * @param {next/router} router - The NextRouter used on components an pages
 */
const useEscToNavigateBack = (router) => {

	const handleEsc = (event) => {
		if (event.keyCode === 27) {
			const oldPath = router.asPath
			router.back()
			const newPath = router.asPath
			if (oldPath === newPath) {
				router.push("/")
			}
		}
  }
  
	useEffect(() => {
		window.addEventListener("keydown", handleEsc)
		// Remove event listeners on cleanup
		return () => {
			window.removeEventListener("keydown", handleEsc)
		}
	}, [])
}
export default useEscToNavigateBack
