class ProductsController < ApplicationController
  def index
    @products = Product.order("name").page(params[:page]).per_page(2)
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @product = Product.new
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to @product, notice: "Successfully created product."
    else
      render :new
    end
  end

  def edit
    @product = Product.find(params[:id])
  end

  def update
    @product = Product.find(params[:id])
    if @product.update_attributes(params[:product])
      redirect_to @product, notice: "Successfully created product."
    else
      render :edit
    end
  end
  
  def destroy
    @product = Product.find(params[:id])
    @product.destroy
    redirect_to products_url, notice: "Successfully destroyed product."
  end
  
  
  private
  
	def product_params
	    params.require(:product).permit(:name, :price, :released_at)
	end
end
