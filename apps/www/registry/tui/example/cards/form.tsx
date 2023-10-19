import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { useState } from "react";


export function CardsForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.type === "email"){
            setEmail(e.target.value);
        } else if(e.target.type === "password"){
            setPassword(e.target.value);
        }
        
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Form</CardTitle>
            </CardHeader>
            <CardContent>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input type="email" label="Email" placeholder="Enter the Email" handleChange={handleChangeClick} />
                            <Input type="password" label="Password" placeholder="Enter the Password" handleChange={handleChangeClick} />
                            <Button type="submit"> Submit  </Button>
                        </div>
                        
                    </form>
            </CardContent>
        </Card>
    )
}
