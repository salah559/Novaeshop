import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/lib/protected-route";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Payment from "@/pages/Payment";
import MyPurchases from "@/pages/MyPurchases";
import AdminDashboard from "@/pages/AdminDashboard";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/cart" component={Cart} />
          <Route path="/payment">
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          </Route>
          <Route path="/purchases">
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          </Route>
          <Route path="/admin">
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Header />
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
