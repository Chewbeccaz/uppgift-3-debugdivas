export const Login = () => {




    return (
        <>
        <h1>Login</h1>
        <form>
            <label>
                Email:
                <input type="email" name="email" />
            </label>
            <br />
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <br />
            <button type="submit">Login</button>


        </form>
        </>
    );
    }