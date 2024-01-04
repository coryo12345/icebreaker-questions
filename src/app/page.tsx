import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main>
      <p>hello world!</p>
      <Card>
        <CardHeader>
          <CardTitle>
            Enter Password
          </CardTitle>
          <CardDescription>
            Enter the secret password to enter the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Password</Label>
          <Input />
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
